import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';
import { 
  CACHE_DURATION, 
  STALE_WHILE_REVALIDATE,
  ALLOWED_AUDIO_TYPES, 
  AUDIO_EXTENSIONS,
  MAX_FILE_SIZE,
  MAX_RECITER_NAME_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MIN_RECITER_NAME_LENGTH,
  TOTAL_SURAHS,
  MIN_SURAH_NUMBER,
  MAX_SURAH_NUMBER,
  RATE_LIMIT_UPLOADS,
  RATE_LIMIT_WINDOW_MS
} from '@/lib/config';

// Simple in-memory rate limiter
const rateLimiter = new Map<string, { count: number; timestamp: number }>();

// Cache recitations for 5 minutes since they can change more frequently
export const revalidate = CACHE_DURATION;

function validateInput(data: {
  surahNumber: number;
  reciterName: string;
  description?: string;
}): { valid: boolean; error?: string } {
  if (!Number.isInteger(data.surahNumber) || data.surahNumber < MIN_SURAH_NUMBER || data.surahNumber > MAX_SURAH_NUMBER) {
    return { valid: false, error: `Invalid surah number. Must be between ${MIN_SURAH_NUMBER} and ${MAX_SURAH_NUMBER}` };
  }
  
  if (!data.reciterName || data.reciterName.trim().length < MIN_RECITER_NAME_LENGTH || data.reciterName.length > MAX_RECITER_NAME_LENGTH) {
    return { valid: false, error: `Invalid reciter name. Must be between ${MIN_RECITER_NAME_LENGTH} and ${MAX_RECITER_NAME_LENGTH} characters` };
  }
  
  if (data.description && data.description.length > MAX_DESCRIPTION_LENGTH) {
    return { valid: false, error: `Description too long (max ${MAX_DESCRIPTION_LENGTH} characters)` };
  }
  
  return { valid: true };
}

function sanitizeFilename(filename: string): string {
  // Remove path traversal characters and special characters
  const sanitized = filename
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
    .replace(/_{2,}/g, '_') // Collapse multiple underscores
    .replace(/^[._]+|[._]+$/g, ''); // Remove leading/trailing dots and underscores
  
  // Ensure no path traversal
  return path.basename(sanitized);
}

export async function GET() {
  try {
    const recitations = await prisma.userRecitation.findMany({
      where: {
        isApproved: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(recitations, {
      headers: {
        'Cache-Control': `public, max-age=${CACHE_DURATION}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
      },
    });
  } catch (error) {
    console.error('Error fetching user recitations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recitations' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let tempFilePath: string | null = null;
  
  // Helper for CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
  };

  try {
    // 1. Authentication Check
    const apiKey = request.headers.get('x-api-key');
    const validApiKey = process.env.API_KEY;
    
    // Only check if API_KEY is set in environment
    if (validApiKey && apiKey !== validApiKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers }
      );
    }

    // 2. Rate Limiting
    // Use IP address as key (fallback to 'unknown' if not available)
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const userLimit = rateLimiter.get(ip) || { count: 0, timestamp: now };

    if (now - userLimit.timestamp > RATE_LIMIT_WINDOW_MS) {
      // Reset window
      userLimit.count = 1;
      userLimit.timestamp = now;
    } else {
      userLimit.count++;
    }
    
    rateLimiter.set(ip, userLimit);

    if (userLimit.count > RATE_LIMIT_UPLOADS) {
      return NextResponse.json(
        { error: 'Too many uploads. Please try again later.' },
        { status: 429, headers }
      );
    }

    const formData = await request.formData();
    
    const surahNumberRaw = formData.get('surahNumber');
    const surahNumber = parseInt(surahNumberRaw as string);
    const reciterNameRaw = formData.get('reciterName') as string;
    const reciterName = reciterNameRaw ? reciterNameRaw.trim() : '';
    const description = formData.get('description') as string;
    const audioFile = formData.get('audio') as File;

    // 3. Validate surahNumber is a number
    if (Number.isNaN(surahNumber)) {
       return NextResponse.json(
        { error: 'Invalid surah number' },
        { status: 400, headers }
      );
    }

    // Validate required fields
    if (!audioFile || !surahNumber || !reciterName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400, headers }
      );
    }

    // Validate file type (MIME type)
    if (!ALLOWED_AUDIO_TYPES.includes(audioFile.type as typeof ALLOWED_AUDIO_TYPES[number])) {
      return NextResponse.json(
        { error: 'Invalid file type. Only MP3, WAV, and OGG files are allowed' },
        { status: 400, headers }
      );
    }

    // 4. Validate file extension
    const fileExt = path.extname(audioFile.name).toLowerCase();
    // We cast to string for the check because typescript might complain about the specific string literal types
    if (!AUDIO_EXTENSIONS.includes(fileExt as any)) {
      return NextResponse.json(
        { error: `Invalid file extension. Allowed: ${AUDIO_EXTENSIONS.join(', ')}` },
        { status: 400, headers }
      );
    }

    // Validate file size
    if (audioFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 50MB' },
        { status: 400, headers }
      );
    }

    // Validate input data
    const validation = validateInput({ surahNumber, reciterName, description });
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400, headers }
      );
    }

    // Convert file to buffer
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate unique filename with sanitization
    const timestamp = Date.now();
    const sanitizedOriginalName = sanitizeFilename(audioFile.name);
    const filename = `${timestamp}_${sanitizedOriginalName}`;
    
    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    
    // Save file (async)
    const filepath = path.join(uploadsDir, filename);
    tempFilePath = filepath;
    await fs.writeFile(filepath, buffer);

    // Create database entry
    const recitation = await prisma.userRecitation.create({
      data: {
        surahNumber,
        reciterName,
        description: description || null,
        audioUrl: `/uploads/${filename}`,
        fileName: sanitizedOriginalName,
        fileSize: audioFile.size,
        isApproved: false, // Require moderation before approval
      },
    });

    return NextResponse.json(recitation, { status: 201, headers });
  } catch (error) {
    // Clean up file on error
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }

    console.error('Error uploading recitation:', error);
    const errorHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
    };
    return NextResponse.json(
      { error: 'Failed to upload recitation' },
      { status: 500, headers: errorHeaders }
    );
  }
}
