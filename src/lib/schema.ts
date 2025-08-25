// Zod schemas for content validation and type safety

import { z } from 'zod';

export const CardTypeSchema = z.enum([
  'goal',
  'listening', 
  'phrase',
  'grammar',
  'mcq',
  'order',
  'ab-test',
  'complete'
]);

export const CardBaseSchema = z.object({
  id: z.string(),
  type: CardTypeSchema,
  title: z.string().optional(),
  body: z.string().optional(),
  audioSrc: z.string().optional(),
  imagePrompt: z.string().optional(),
  options: z.array(z.string()).optional(),
  answer: z.union([z.number(), z.array(z.string())]).optional(),
  explanation: z.string().optional(),
});

export const MicroCourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  textbookRef: z.string().optional(),
  cards: z.array(CardBaseSchema),
  lockAfter: z.boolean().optional(),
  prerequisite: z.string().optional(),
});

export const LessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  courses: z.array(MicroCourseSchema),
});

export const UserSettingsSchema = z.object({
  audioRate: z.number().min(0.5).max(2.0).default(1.0),
  textScale: z.number().min(0.75).max(1.5).default(1.0),
  theme: z.enum(['system', 'light', 'dark']).default('system'),
  language: z.enum(['ja', 'en']).default('ja'),
  autoPlay: z.boolean().default(true),
  vibration: z.boolean().default(true),
});

export const UserStatsSchema = z.object({
  totalStudyTime: z.number().default(0),
  cardsCompleted: z.number().default(0),
  coursesCompleted: z.number().default(0),
  lessonsCompleted: z.number().default(0),
  streak: z.object({
    current: z.number().default(0),
    longest: z.number().default(0),
    lastStudyDate: z.number().optional(),
  }).default(() => ({ current: 0, longest: 0 })),
  accuracy: z.object({
    overall: z.number().min(0).max(100).default(0),
    byCardType: z.record(z.string(), z.number()).default({}),
  }).default(() => ({ overall: 0, byCardType: {} })),
});

export const UserProgressSchema = z.object({
  lessons: z.record(z.string(), z.object({
    completedCourses: z.array(z.string()).default([]),
    cardProgress: z.record(z.string(), z.object({
      completed: z.boolean(),
      attempts: z.number(),
      lastAttempt: z.number(),
      score: z.number().optional(),
    })).default({}),
    lastAccessed: z.number().optional(),
  })).default({}),
  lastPlayed: z.object({
    lessonId: z.string(),
    courseId: z.string(),
    cardId: z.string(),
  }).optional(),
  settings: UserSettingsSchema.default(() => UserSettingsSchema.parse({})),
  statistics: UserStatsSchema.default(() => UserStatsSchema.parse({})),
});

export const ContentManifestSchema = z.object({
  lessons: z.array(LessonSchema),
  version: z.string(),
  lastUpdated: z.number(),
});

// Export inferred types
export type CardType = z.infer<typeof CardTypeSchema>;
export type CardBase = z.infer<typeof CardBaseSchema>;
export type MicroCourse = z.infer<typeof MicroCourseSchema>;
export type Lesson = z.infer<typeof LessonSchema>;
export type UserSettings = z.infer<typeof UserSettingsSchema>;
export type UserStats = z.infer<typeof UserStatsSchema>;
export type UserProgress = z.infer<typeof UserProgressSchema>;
export type ContentManifest = z.infer<typeof ContentManifestSchema>;

// Validation functions
export function validateLesson(data: unknown): Lesson {
  return LessonSchema.parse(data);
}

export function validateUserProgress(data: unknown): UserProgress {
  return UserProgressSchema.parse(data);
}

export function validateContentManifest(data: unknown): ContentManifest {
  return ContentManifestSchema.parse(data);
}

// Default values
export const defaultUserProgress = (): UserProgress => UserProgressSchema.parse({});

export const defaultUserSettings = (): UserSettings => UserSettingsSchema.parse({});

export const defaultUserStats = (): UserStats => UserStatsSchema.parse({});