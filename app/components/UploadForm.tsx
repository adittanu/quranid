'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Mic, FileAudio, AlertCircle } from 'lucide-react';

interface UploadFormProps {
  surahNumber: number;
  surahName: string;
  onUploadSuccess: () => void;
  onCancel: () => void;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg'];

export default function UploadForm({
  surahNumber,
  surahName,
  onUploadSuccess,
  onCancel,
}: UploadFormProps) {
  const [reciterName, setReciterName] = useState('');
  const [description, setDescription] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    return (bytes / 1024 / 1024).toFixed(2);
  };

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Only MP3, WAV, and OGG files are allowed';
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)} MB`;
    }
    return null;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validationError = validateFile(file);
      
      if (validationError) {
        setError(validationError);
        return;
      }
      
      setAudioFile(file);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validationError = validateFile(file);
      
      if (validationError) {
        setError(validationError);
        return;
      }
      
      setAudioFile(file);
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!audioFile || !reciterName) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('surahNumber', surahNumber.toString());
      formData.append('reciterName', reciterName);
      formData.append('description', description);

      const response = await fetch('/api/recitations', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        onUploadSuccess();
      } else {
        let errorMessage = 'Upload failed. Please try again.';
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          try {
            const data = await response.json();
            if (data.error) errorMessage = data.error;
          } catch (e) {
            console.error('Failed to parse error response:', e);
          }
        }
        
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Upload error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setUploading(false);
    }
  }, [audioFile, reciterName, description, surahNumber, onUploadSuccess]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Upload Recitation</h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Cancel upload"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-emerald-50 p-4 rounded-xl">
          <p className="text-sm text-emerald-800">
            <span className="font-semibold">Surah:</span> {surahName}
          </p>
        </div>

        <div>
          <label htmlFor="reciter-name" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name / Reciter Name *
          </label>
          <input
            id="reciter-name"
            type="text"
            required
            value={reciterName}
            onChange={(e) => setReciterName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description about your recitation..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Audio File *
          </label>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-gray-300 hover:border-emerald-400'
            }`}
          >
            <input
              type="file"
              accept={ALLOWED_TYPES.join(',')}
              onChange={handleFileChange}
              className="hidden"
              id="audio-upload"
            />
            <label
              htmlFor="audio-upload"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              {audioFile ? (
                <>
                  <FileAudio size={48} className="text-emerald-600" />
                  <p className="text-sm text-gray-600 font-medium">{audioFile.name}</p>
                  <p className="text-xs text-gray-400">
                    {formatFileSize(audioFile.size)} MB
                  </p>
                </>
              ) : (
                <>
                  <Mic size={48} className="text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Drag and drop your audio file here, or click to browse
                  </p>
                  <p className="text-xs text-gray-400">Supports MP3, WAV, OGG (max 50MB)</p>
                </>
              )}
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={!audioFile || !reciterName || uploading}
          className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload size={20} />
              <span>Upload Recitation</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
