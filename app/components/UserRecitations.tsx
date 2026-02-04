'use client';

import { useState, useCallback, memo } from 'react';
import { Play, User } from 'lucide-react';
import { UserRecitation } from '@/types';

interface UserRecitationsProps {
  recitations: UserRecitation[];
  onSelectRecitation: (recitation: UserRecitation) => void;
  currentRecitationId?: number;
}

function UserRecitations({
  recitations,
  onSelectRecitation,
  currentRecitationId,
}: UserRecitationsProps) {
  if (recitations.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">User Recitations</h2>
        <p className="text-gray-500 text-center py-8">
          No user recitations yet. Be the first to upload!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-amber-500 to-orange-500">
        <h2 className="text-xl font-bold text-white">User Recitations</h2>
        <p className="text-amber-100 text-sm mt-1">{recitations.length} recitations uploaded</p>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {recitations.map((recitation) => (
          <button
            key={recitation.id}
            onClick={() => onSelectRecitation(recitation)}
            className={`w-full text-left p-4 border-b border-gray-100 transition-all hover:bg-amber-50 ${
              currentRecitationId === recitation.id
                ? 'bg-amber-50 border-l-4 border-l-amber-500'
                : 'border-l-4 border-l-transparent'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Play size={20} className="text-amber-600" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-gray-400" />
                  <span className="font-medium text-gray-900 truncate">
                    {recitation.reciterName}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  Surah {recitation.surahNumber}
                </p>

                {recitation.description && (
                  <p className="text-xs text-gray-400 mt-1 truncate">
                    {recitation.description}
                  </p>
                )}

                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span>{recitation.playCount} plays</span>
                  <span>
                    {new Date(recitation.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Export memoized version
export default memo(UserRecitations);
