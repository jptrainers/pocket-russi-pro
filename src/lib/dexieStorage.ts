// IndexedDB storage adapter using Dexie for offline data persistence

import Dexie, { Table } from 'dexie';
import { UserProgress, UserSettings } from '@/types/content';

// Database schema
export interface ProgressRecord {
  id: string;
  data: UserProgress;
  lastModified: number;
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  blob: Blob;
  url: string;
  createdAt: number;
}

export interface AudioCache {
  id: string;
  src: string;
  blob: Blob;
  lastAccessed: number;
}

class PocketRussianDB extends Dexie {
  progress!: Table<ProgressRecord>;
  images!: Table<GeneratedImage>;
  audio!: Table<AudioCache>;

  constructor() {
    super('PocketRussianDB');
    
    this.version(1).stores({
      progress: '++id, lastModified',
      images: '++id, prompt, createdAt', 
      audio: '++id, src, lastAccessed'
    });
  }
}

export const db = new PocketRussianDB();

// Zustand persist storage adapter for IndexedDB
export const dexieStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const record = await db.progress.where('id').equals(name).first();
      return record ? JSON.stringify(record.data) : null;
    } catch (error) {
      console.error('Error reading from IndexedDB:', error);
      return null;
    }
  },
  
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      const data = JSON.parse(value) as UserProgress;
      await db.progress.put({
        id: name,
        data,
        lastModified: Date.now()
      });
    } catch (error) {
      console.error('Error writing to IndexedDB:', error);
    }
  },
  
  removeItem: async (name: string): Promise<void> => {
    try {
      await db.progress.where('id').equals(name).delete();
    } catch (error) {
      console.error('Error deleting from IndexedDB:', error);
    }
  }
};

// Image generation cache functions
export async function getCachedImage(prompt: string): Promise<string | null> {
  try {
    const image = await db.images.where('prompt').equals(prompt).first();
    return image ? image.url : null;
  } catch (error) {
    console.error('Error reading image cache:', error);
    return null;
  }
}

export async function cacheGeneratedImage(
  prompt: string, 
  blob: Blob
): Promise<string> {
  try {
    const url = URL.createObjectURL(blob);
    await db.images.add({
      id: crypto.randomUUID(),
      prompt,
      blob,
      url,
      createdAt: Date.now()
    });
    return url;
  } catch (error) {
    console.error('Error caching image:', error);
    throw error;
  }
}

// Audio cache functions
export async function getCachedAudio(src: string): Promise<Blob | null> {
  try {
    const audio = await db.audio.where('src').equals(src).first();
    if (audio) {
      // Update last accessed time
      await db.audio.update(audio.id, { lastAccessed: Date.now() });
      return audio.blob;
    }
    return null;
  } catch (error) {
    console.error('Error reading audio cache:', error);
    return null;
  }
}

export async function cacheAudio(src: string, blob: Blob): Promise<void> {
  try {
    await db.audio.add({
      id: crypto.randomUUID(),
      src,
      blob,
      lastAccessed: Date.now()
    });
  } catch (error) {
    console.error('Error caching audio:', error);
  }
}

// Cleanup functions for managing storage size
export async function cleanupOldImages(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
  try {
    const cutoff = Date.now() - maxAge;
    await db.images.where('createdAt').below(cutoff).delete();
  } catch (error) {
    console.error('Error cleaning up images:', error);
  }
}

export async function cleanupOldAudio(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
  try {
    const cutoff = Date.now() - maxAge;
    await db.audio.where('lastAccessed').below(cutoff).delete();
  } catch (error) {
    console.error('Error cleaning up audio:', error);
  }
}

// Export/Import functions for backup
export async function exportUserData(): Promise<string> {
  try {
    const progress = await db.progress.toArray();
    return JSON.stringify({ progress, exportedAt: Date.now() });
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
}

export async function importUserData(jsonData: string): Promise<void> {
  try {
    const data = JSON.parse(jsonData);
    if (data.progress && Array.isArray(data.progress)) {
      await db.progress.clear();
      await db.progress.bulkAdd(data.progress);
    }
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
}