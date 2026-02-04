'use client';

import { useState, useMemo, memo } from 'react';
import { BookOpen, MapPin } from 'lucide-react';
import { Surah } from '@/types';

interface SurahListProps {
  surahs: Surah[];
  onSelectSurah: (surah: Surah) => void;
  selectedSurahId?: number;
}

function SurahList({ surahs, onSelectSurah, selectedSurahId }: SurahListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Memoized filtering to prevent unnecessary re-computation
  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return surahs;
    
    const query = searchQuery.toLowerCase();
    return surahs.filter(
      (surah) =>
        surah.englishName.toLowerCase().includes(query) ||
        surah.englishNameTranslation.toLowerCase().includes(query) ||
        surah.name.includes(searchQuery)
    );
  }, [surahs, searchQuery]);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600">
        <h2 className="text-2xl font-bold text-white mb-4">Quran Surahs</h2>
        <input
          type="text"
          placeholder="Search surahs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-emerald-300 bg-white/95 placeholder-gray-400"
        />
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        {filteredSurahs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No results found</p>
          </div>
        ) : (
          filteredSurahs.map((surah) => (
            <button
              key={surah.id}
              onClick={() => onSelectSurah(surah)}
              className={`w-full text-left p-4 border-b border-gray-100 transition-all hover:bg-emerald-50 ${
                selectedSurahId === surah.id
                  ? 'bg-emerald-50 border-l-4 border-l-emerald-500'
                  : 'border-l-4 border-l-transparent'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <span className="text-emerald-700 font-bold">{surah.number}</span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{surah.englishName}</h3>
                    <span className="text-2xl text-emerald-600 font-arabic">{surah.name}</span>
                  </div>
                  <p className="text-sm text-gray-500">{surah.englishNameTranslation}</p>

                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <BookOpen size={12} />
                      {surah.numberOfAyahs} verses
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {surah.revelationType}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

// Export memoized version
export default memo(SurahList);
