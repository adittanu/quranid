import { prisma } from '@/lib/prisma';
import { Surah, UserRecitation } from '@/types';
import QuranPageClient from '../QuranPageClient';
import ErrorBoundary from '../components/ErrorBoundary';

export const revalidate = 3600; // Revalidate every hour

async function getSurahs(): Promise<Surah[]> {
  try {
    const surahs = await prisma.surah.findMany({
      orderBy: {
        number: 'asc',
      },
    });
    return surahs;
  } catch (error) {
    console.error('Failed to fetch surahs:', error);
    return [];
  }
}

async function getUserRecitations(): Promise<UserRecitation[]> {
  try {
    const recitations = await prisma.userRecitation.findMany({
      where: {
        isApproved: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return recitations;
  } catch (error) {
    console.error('Failed to fetch user recitations:', error);
    return [];
  }
}

export default async function AppPage() {
  // Parallel data fetching on server
  try {
    const [surahs, recitations] = await Promise.all([
      getSurahs(),
      getUserRecitations(),
    ]);

    if (surahs.length === 0) {
      throw new Error('Failed to load Quran data');
    }

    return (
      <ErrorBoundary>
        <QuranPageClient 
          initialSurahs={surahs} 
          initialRecitations={recitations} 
        />
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Error in AppPage:', error);
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-red-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Page</h2>
          <p className="text-gray-600">
            We encountered an issue while loading the Quran data. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
