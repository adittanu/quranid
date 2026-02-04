// Application configuration constants
// Centralized location for all magic numbers and configuration values

// File upload configuration
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
export const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/mp3',
  'audio/m4a',
  'audio/aac',
] as const;

// Rate limiting configuration
export const RATE_LIMIT_UPLOADS = 5; // Maximum uploads per time window
export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour in milliseconds

// Cache configuration (in seconds)
export const CACHE_DURATION = 300; // 5 minutes
export const CACHE_DURATION_LONG = 3600; // 1 hour
export const CACHE_DURATION_SHORT = 60; // 1 minute
export const STALE_WHILE_REVALIDATE = 3600; // 1 hour

// Database configuration
export const DATABASE_CONNECTION_TIMEOUT = 10000; // 10 seconds
export const DATABASE_POOL_SIZE = 10;
export const DATABASE_IDLE_TIMEOUT = 30000; // 30 seconds

// Audio player configuration
export const AUDIO_PRELOAD_BUFFER = 30; // seconds to preload
export const AUDIO_VOLUME_DEFAULT = 0.8; // 80% volume
export const AUDIO_VOLUME_STEP = 0.1; // 10% step for volume control
export const AUDIO_SEEK_STEP = 10; // 10 seconds skip

// UI configuration
export const DEBOUNCE_DELAY = 300; // milliseconds
export const TOAST_DURATION = 5000; // 5 seconds
export const MODAL_ANIMATION_DURATION = 200; // milliseconds
export const SCROLL_THRESHOLD = 100; // pixels before showing scroll-to-top

// Pagination configuration
export const ITEMS_PER_PAGE = 20;
export const MAX_PAGES_SHOWN = 5;

// Surah configuration
export const TOTAL_SURAHS = 114;
export const MIN_SURAH_NUMBER = 1;
export const MAX_SURAH_NUMBER = 114;

// Validation configuration
export const MAX_RECITER_NAME_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;
export const MIN_RECITER_NAME_LENGTH = 1;

// API configuration
export const API_TIMEOUT = 30000; // 30 seconds
export const API_RETRY_ATTEMPTS = 3;
export const API_RETRY_DELAY = 1000; // 1 second

// Security configuration
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Feature flags
export const FEATURES = {
  ENABLE_USER_UPLOADS: true,
  ENABLE_MODERATION: true,
  ENABLE_ANALYTICS: process.env.NODE_ENV === 'production',
  ENABLE_OFFLINE_MODE: false,
} as const;

// Environment
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_TEST = process.env.NODE_ENV === 'test';

// Paths
export const UPLOADS_DIR = '/uploads';
export const PUBLIC_DIR = 'public';
export const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'] as const;

// Type exports for allowed audio types
export type AllowedAudioType = (typeof ALLOWED_AUDIO_TYPES)[number];
export type AudioExtension = (typeof AUDIO_EXTENSIONS)[number];
