export interface Surah {
  id: number;
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
}

export interface Ayah {
  id: number;
  number: number;
  text: string;
  textIndopak?: string;
  transliteration?: string;
  translation: string;
  juz: number;
  page: number;
  surahId: number;
}

export interface UserRecitation {
  id: number;
  surahNumber: number;
  ayahNumber: number | null;
  reciterName: string;
  audioUrl: string;
  fileName: string;
  description: string | null;
  fileSize: number;
  duration: number | null;
  isApproved: boolean;
  playCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Recitation {
  id: number;
  surahId: number;
  reciterName: string;
  reciterId?: string;
  audioUrl: string;
  format: string;
  isOfficial: boolean;
  isUserUpload: boolean;
  userName?: string;
  userId?: string;
  fileSize?: number;
  duration?: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CurrentRecitation {
  audioUrl: string;
  surahName: string;
  reciterName: string;
  recitationId?: number;
}
