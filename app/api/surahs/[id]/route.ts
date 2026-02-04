import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const surahNumber = parseInt(id);

    if (Number.isNaN(surahNumber)) {
      return NextResponse.json(
        { error: 'Invalid surah ID' },
        { status: 404 }
      );
    }
    
    const surah = await prisma.surah.findUnique({
      where: { number: surahNumber },
      include: {
        ayahs: {
          orderBy: {
            number: 'asc',
          },
        },
        recitations: true,
      },
    });

    if (!surah) {
      return NextResponse.json(
        { error: 'Surah not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(surah);
  } catch (error) {
    console.error('Error fetching surah:', error);
    return NextResponse.json(
      { error: 'Failed to fetch surah' },
      { status: 500 }
    );
  }
}
