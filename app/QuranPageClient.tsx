'use client';

import { useState, useCallback, memo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Upload, ArrowLeft } from 'lucide-react';
import SurahList from './components/SurahList';
import AudioPlayer from './components/AudioPlayer';
import UploadForm from './components/UploadForm';
import UserRecitations from './components/UserRecitations';
import { Surah, UserRecitation, CurrentRecitation } from '@/types';

interface QuranPageClientProps {
  initialSurahs: Surah[];
  initialRecitations: UserRecitation[];
}

// Memoized components to prevent unnecessary re-renders
const MemoizedSurahList = memo(SurahList);
const MemoizedUserRecitations = memo(UserRecitations);

export default function QuranPageClient({
  initialSurahs,
  initialRecitations,
}: QuranPageClientProps) {
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [currentRecitation, setCurrentRecitation] = useState<CurrentRecitation | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadSurah, setUploadSurah] = useState<Surah | null>(null);
  const [userRecitations, setUserRecitations] = useState<UserRecitation[]>(initialRecitations);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSelectSurah = useCallback((surah: Surah) => {
    setSelectedSurah(surah);
    // Use Al Quran Cloud API for real audio - Mishary Alafasy recitation
    const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${surah.number}.mp3`;
    setCurrentRecitation({
      audioUrl,
      surahName: `${surah.englishName} (${surah.name})`,
      reciterName: 'Mishary Alafasy',
    });
  }, []);

  const handleSelectUserRecitation = useCallback((recitation: UserRecitation) => {
    // Find surah name from initialSurahs
    const surah = initialSurahs.find(s => s.number === recitation.surahNumber);
    const surahName = surah 
      ? `${surah.englishName} (${surah.name})`
      : `Surah ${recitation.surahNumber}`;
    
    setCurrentRecitation({
      audioUrl: recitation.audioUrl,
      surahName,
      reciterName: recitation.reciterName,
      recitationId: recitation.id,
    });
  }, [initialSurahs]);

  const handleUploadClick = useCallback(() => {
    if (selectedSurah) {
      setUploadSurah(selectedSurah);
      setShowUploadForm(true);
    } else {
      alert('Please select a surah first to upload a recitation for it.');
    }
  }, [selectedSurah]);

  const handleUploadSuccess = useCallback(() => {
    setShowUploadForm(false);
    setUploadSurah(null);
    // Refresh recitations by fetching again
    fetch('/api/recitations')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch recitations');
        }
        return res.json();
      })
      .then((data: unknown) => {
        if (!isMounted.current) return;
        
        // Type guard to ensure data is UserRecitation[]
        const isValidRecitation = (item: any): item is UserRecitation => {
          return (
            typeof item === 'object' &&
            item !== null &&
            typeof item.id === 'number' &&
            typeof item.surahNumber === 'number' &&
            typeof item.audioUrl === 'string'
          );
        };

        if (Array.isArray(data) && data.every(isValidRecitation)) {
          setUserRecitations(data);
        } else {
          console.error('Invalid data format received from API');
        }
      })
      .catch((error) => {
        if (isMounted.current) {
          console.error('Error fetching recitations:', error);
        }
      });
  }, []);

  const handleCancelUpload = useCallback(() => {
    setShowUploadForm(false);
    setUploadSurah(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <BookOpen className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                QuranID
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-1 px-3 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors text-sm font-medium"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Back</span>
              </Link>
              <button
                onClick={handleUploadClick}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-shadow"
              >
                <Upload size={18} />
                <span className="hidden sm:inline">Upload Recitation</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 sm:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Surah List */}
          <div className="space-y-6">
            <MemoizedSurahList
              surahs={initialSurahs}
              onSelectSurah={handleSelectSurah}
              selectedSurahId={selectedSurah?.id}
            />
          </div>

          {/* Right Column - User Recitations or Upload Form */}
          <div className="space-y-6">
            {showUploadForm && uploadSurah ? (
              <UploadForm
                surahNumber={uploadSurah.number}
                surahName={`${uploadSurah.englishName} (${uploadSurah.name})`}
                onUploadSuccess={handleUploadSuccess}
                onCancel={handleCancelUpload}
              />
            ) : (
              <>
                <MemoizedUserRecitations
                  recitations={userRecitations}
                  onSelectRecitation={handleSelectUserRecitation}
                  currentRecitationId={currentRecitation?.recitationId}
                />

                {/* Info Card */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-lg p-6 text-white">
                  <h3 className="text-lg font-bold mb-2">How to Use</h3>
                  <ul className="space-y-2 text-sm text-emerald-100">
                    <li className="flex items-start gap-2">
                      <span className="bg-emerald-500 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">1</span>
                      Select a surah from the list on the left
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-emerald-500 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">2</span>
                      Click "Upload Recitation" to share your recitation
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-emerald-500 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">3</span>
                      Listen to user recitations on the right
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Audio Player */}
      {currentRecitation && (
        <AudioPlayer
          audioUrl={currentRecitation.audioUrl}
          surahName={currentRecitation.surahName}
          reciterName={currentRecitation.reciterName}
        />
      )}
    </div>
  );
}
