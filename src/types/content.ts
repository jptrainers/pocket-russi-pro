// Core types for Pocket Russian Trainer content structure

export type CardType =
  | 'goal'        // 目標提示カード
  | 'listening'   // リスニングカード
  | 'phrase'      // フレーズ/単語紹介カード
  | 'grammar'     // 文法解説カード
  | 'mcq'         // 選択式クイズカード
  | 'order'       // 並べ替えクイズカード
  | 'ab-test'     // 聞き比べカード
  | 'complete';   // 完了カード

export interface CardBase {
  id: string;
  type: CardType;
  title?: string;
  body?: string;              // Markdown permitted
  audioSrc?: string;          // /public/audio/... relative path
  imagePrompt?: string;       // [IMG: "..."] equivalent
  options?: string[];         // For MCQ/order cards
  answer?: number | string[]; // MCQ correct index / order correct sequence
  explanation?: string;       // Optional explanation after answer
}

export interface MicroCourse {
  id: string;                 // X-1, X-2, etc.
  title: string;
  textbookRef?: string;       // Reference like "p.20-21"
  cards: CardBase[];
  lockAfter?: boolean;        // Lock course until prerequisite completed
  prerequisite?: string;      // ID of required course
}

export interface Lesson {
  id: string;                 // 1..22
  title: string;
  description?: string;
  courses: MicroCourse[];
}

export interface UserProgress {
  lessons: Record<string, {
    completedCourses: string[];
    cardProgress: Record<string, {
      completed: boolean;
      attempts: number;
      lastAttempt: number; // timestamp
      score?: number;      // 0-100
    }>;
    lastAccessed?: number;   // timestamp
  }>;
  lastPlayed?: { 
    lessonId: string; 
    courseId: string; 
    cardId: string; 
  };
  settings: UserSettings;
  statistics: UserStats;
}

export interface UserSettings {
  audioRate: number;           // 0.5..2.0
  textScale: number;           // 0.75..1.5
  theme: 'system' | 'light' | 'dark';
  language: 'ja' | 'en';      // Interface language
  autoPlay: boolean;          // Auto-play audio
  vibration: boolean;         // Haptic feedback
}

export interface UserStats {
  totalStudyTime: number;     // milliseconds
  cardsCompleted: number;
  coursesCompleted: number;
  lessonsCompleted: number;
  streak: {
    current: number;          // days
    longest: number;
    lastStudyDate?: number;   // timestamp
  };
  accuracy: {
    overall: number;          // 0-100
    byCardType: Partial<Record<CardType, number>>;
  };
}

// Content validation and helper types
export interface ContentManifest {
  lessons: Lesson[];
  version: string;
  lastUpdated: number;
}

// UI State types
export type PlayerState = 
  | 'loading'
  | 'ready' 
  | 'playing'
  | 'answering'
  | 'feedback'
  | 'complete';

export interface PlayerContext {
  lessonId: string;
  courseId: string;
  currentCardIndex: number;
  totalCards: number;
  state: PlayerState;
  userAnswer?: any;
  showFeedback: boolean;
  score: number;
}

// Audio and Media types
export interface AudioConfig {
  src: string;
  rate?: number;
  autoPlay?: boolean;
  loop?: boolean;
}

export interface ImageGeneration {
  prompt: string;
  url?: string;
  cached: boolean;
  loading: boolean;
  error?: string;
}

// Default values
export const defaultUserProgress = (): UserProgress => ({
  lessons: {},
  settings: {
    audioRate: 1.0,
    textScale: 1.0,
    theme: 'system',
    language: 'ja',
    autoPlay: true,
    vibration: true,
  },
  statistics: {
    totalStudyTime: 0,
    cardsCompleted: 0,
    coursesCompleted: 0,
    lessonsCompleted: 0,
    streak: {
      current: 0,
      longest: 0,
    },
    accuracy: {
      overall: 0,
      byCardType: {},
    },
  },
});