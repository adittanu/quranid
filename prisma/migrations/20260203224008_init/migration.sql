-- CreateTable
CREATE TABLE "surahs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "englishName" TEXT NOT NULL,
    "englishNameTranslation" TEXT NOT NULL,
    "revelationType" TEXT NOT NULL,
    "numberOfAyahs" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ayahs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "textIndopak" TEXT,
    "transliteration" TEXT,
    "translation" TEXT NOT NULL,
    "juz" INTEGER NOT NULL,
    "page" INTEGER NOT NULL,
    "surahId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ayahs_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "surahs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "audio_timestamps" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ayahId" INTEGER NOT NULL,
    "startTime" REAL NOT NULL,
    "endTime" REAL NOT NULL,
    "recitationId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audio_timestamps_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "ayahs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "audio_timestamps_recitationId_fkey" FOREIGN KEY ("recitationId") REFERENCES "recitations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "recitations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "surahId" INTEGER NOT NULL,
    "reciterName" TEXT NOT NULL,
    "reciterId" TEXT,
    "audioUrl" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "isOfficial" BOOLEAN NOT NULL DEFAULT false,
    "isUserUpload" BOOLEAN NOT NULL DEFAULT false,
    "userName" TEXT,
    "userId" TEXT,
    "fileSize" INTEGER,
    "duration" REAL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "recitations_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "surahs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_recitations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "surahNumber" INTEGER NOT NULL,
    "ayahNumber" INTEGER,
    "reciterName" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "duration" REAL,
    "description" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "playCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "surahs_number_key" ON "surahs"("number");

-- CreateIndex
CREATE UNIQUE INDEX "ayahs_surahId_number_key" ON "ayahs"("surahId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");
