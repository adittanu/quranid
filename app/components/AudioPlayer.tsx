'use client';

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Repeat,
} from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  surahName: string;
  reciterName: string;
  onNext?: () => void;
  onPrevious?: () => void;
}

function AudioPlayer({
  audioUrl,
  surahName,
  reciterName,
  onNext,
  onPrevious,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Memoized event handlers to prevent unnecessary re-renders
  const updateTime = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const updateDuration = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, []);

  const handleEnded = useCallback(() => {
    if (!isLooping && onNext) {
      onNext();
    } else if (isLooping && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [isLooping, onNext]);

  const getErrorMessage = (code: number): string => {
    switch (code) {
      case 1: return 'MEDIA_ERR_ABORTED - Fetching process aborted';
      case 2: return 'MEDIA_ERR_NETWORK - Network error while fetching';
      case 3: return 'MEDIA_ERR_DECODE - Error decoding media';
      case 4: return 'MEDIA_ERR_SRC_NOT_SUPPORTED - Media format not supported';
      default: return `Unknown error (code: ${code})`;
    }
  };

  const handleError = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.error) {
      const errorCode = audio.error.code;
      console.error('Audio error:', {
        code: errorCode,
        message: getErrorMessage(errorCode),
        src: audio.src,
      });
    } else if (audio) {
      console.error('Audio error occurred but error object is null. src:', audio.src);
    }
    setIsPlaying(false);
    setDuration(0);
    setHasError(true);
  }, []);

  const handleVolumeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      setVolume(audio.volume);
      setIsMuted(audio.muted || audio.volume === 0);
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Use a stable reference for cleanup
    const currentAudio = audio;

    currentAudio.addEventListener('timeupdate', updateTime);
    currentAudio.addEventListener('loadedmetadata', updateDuration);
    currentAudio.addEventListener('ended', handleEnded);
    currentAudio.addEventListener('error', handleError);
    currentAudio.addEventListener('volumechange', handleVolumeUpdate);

    return () => {
      currentAudio.removeEventListener('timeupdate', updateTime);
      currentAudio.removeEventListener('loadedmetadata', updateDuration);
      currentAudio.removeEventListener('ended', handleEnded);
      currentAudio.removeEventListener('error', handleError);
      currentAudio.removeEventListener('volumechange', handleVolumeUpdate);
    };
  }, [updateTime, updateDuration, handleEnded, handleError, handleVolumeUpdate]);

  // Handle audio URL changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    const wasPlaying = isPlayingRef.current;
    audio.src = audioUrl;
    audio.load();

    // Reset state for new track
    setCurrentTime(0);
    setDuration(0);
    setHasError(false);

    if (wasPlaying) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [audioUrl]);

  // Sync loop state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.src = '';
        audio.load();
      }
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error('Failed to play audio:', err);
          setIsPlaying(false);
        });
    }
  }, [isPlaying, audioUrl]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
    setIsMuted(vol === 0);
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume || 1;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const toggleLoop = useCallback(() => {
    setIsLooping(prev => !prev);
  }, []);

  const formatTime = useCallback((time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-2 sm:p-3 shadow-2xl">
      <audio ref={audioRef} src={audioUrl || undefined} preload="metadata" />

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Track Info - Compact */}
          <div className="hidden sm:block w-48 flex-shrink-0">
            <h3 className="text-sm font-semibold truncate">{surahName}</h3>
            <p className="text-xs text-emerald-200 truncate">{reciterName}</p>
            {hasError && (
              <p className="text-[10px] text-red-300">Failed to load</p>
            )}
          </div>

          {/* Mobile Track Info */}
          <div className="sm:hidden flex-shrink-0">
            <h3 className="text-xs font-semibold truncate max-w-[100px]">{surahName}</h3>
            {hasError && (
              <p className="text-[10px] text-red-300">Failed</p>
            )}
          </div>

          {/* Progress + Controls Combined */}
          <div className="flex-1 flex flex-col gap-1.5 min-w-0">
            {/* Progress Bar */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-emerald-200 w-8 text-right">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1 bg-emerald-700 rounded-lg appearance-none cursor-pointer accent-emerald-400 hover:accent-emerald-300"
                aria-label="Seek"
              />
              <span className="text-[10px] text-emerald-200 w-8">{formatTime(duration)}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <button
                onClick={toggleLoop}
                className={`p-1 rounded-full transition-colors ${
                  isLooping ? 'bg-emerald-600 text-white' : 'text-emerald-300 hover:text-white'
                }`}
                title="Loop"
                aria-label={isLooping ? 'Disable loop' : 'Enable loop'}
              >
                <Repeat size={14} />
              </button>

              <button
                onClick={onPrevious}
                className="p-1 text-emerald-200 hover:text-white transition-colors disabled:opacity-50"
                title="Previous"
                aria-label="Previous track"
                disabled={!onPrevious}
              >
                <SkipBack size={18} />
              </button>

              <button
                onClick={togglePlay}
                className="p-2 bg-emerald-500 hover:bg-emerald-400 rounded-full text-white shadow-md transition-transform hover:scale-105 active:scale-95"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>

              <button
                onClick={onNext}
                className="p-1 text-emerald-200 hover:text-white transition-colors disabled:opacity-50"
                title="Next"
                aria-label="Next track"
                disabled={!onNext}
              >
                <SkipForward size={18} />
              </button>

              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={toggleMute}
                  className="p-1 text-emerald-200 hover:text-white transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-14 sm:w-16 h-1 bg-emerald-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  aria-label="Volume"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export memoized version to prevent unnecessary re-renders
export default memo(AudioPlayer);
