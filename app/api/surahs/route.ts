import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Cache surahs for 1 hour since they rarely change
export const revalidate = 3600;

export async function GET() {
  try {
    const surahs = await prisma.surah.findMany({
      orderBy: {
        number: 'asc',
      },
    });
    
    return NextResponse.json(surahs, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching surahs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch surahs' },
      { status: 500 }
    );
  }
}
