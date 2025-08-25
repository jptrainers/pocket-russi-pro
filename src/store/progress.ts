// Zustand store for user progress and app state management

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { dexieStorage } from '@/lib/dexieStorage';
import { 
  UserProgress, 
  UserSettings, 
  PlayerContext, 
  CardType,
  defaultUserProgress 
} from '@/types/content';

interface ProgressStore {
  // State
  progress: UserProgress;
  playerContext: PlayerContext | null;
  
  // Actions
  setProgress: (update: Partial<UserProgress>) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  
  // Card progress actions
  markCardComplete: (lessonId: string, courseId: string, cardId: string, score?: number) => void;
  markCardAttempt: (lessonId: string, courseId: string, cardId: string) => void;
  
  // Course and lesson actions
  markCourseComplete: (lessonId: string, courseId: string) => void;
  checkLessonComplete: (lessonId: string) => boolean;
  
  // Statistics updates
  updateStudyTime: (milliseconds: number) => void;
  updateStreak: () => void;
  updateAccuracy: (cardType: CardType, correct: boolean) => void;
  
  // Player context
  setPlayerContext: (context: PlayerContext | null) => void;
  updatePlayerContext: (update: Partial<PlayerContext>) => void;
  
  // Utility functions
  getCourseProgress: (lessonId: string, courseId: string) => number;
  getLessonProgress: (lessonId: string) => number;
  isCourseUnlocked: (lessonId: string, courseId: string) => boolean;
  getLastPlayed: () => { lessonId: string; courseId: string; cardId: string } | null;
}

export const useProgress = create<ProgressStore>()(
  persist(
    (set, get) => ({
      // Initial state
      progress: defaultUserProgress(),
      playerContext: null,

      // Basic actions
      setProgress: (update) => 
        set((state) => ({
          progress: { ...state.progress, ...update }
        })),

      updateSettings: (settings) =>
        set((state) => ({
          progress: {
            ...state.progress,
            settings: { ...state.progress.settings, ...settings }
          }
        })),

      // Card progress management
      markCardComplete: (lessonId, courseId, cardId, score = 100) => 
        set((state) => {
          const lessonData = state.progress.lessons[lessonId] || {
            completedCourses: [],
            cardProgress: {}
          };

          const cardData = lessonData.cardProgress[cardId] || {
            completed: false,
            attempts: 0,
            lastAttempt: 0
          };

          const updatedProgress = {
            ...state.progress,
            lessons: {
              ...state.progress.lessons,
              [lessonId]: {
                ...lessonData,
                cardProgress: {
                  ...lessonData.cardProgress,
                  [cardId]: {
                    ...cardData,
                    completed: true,
                    attempts: cardData.attempts + 1,
                    lastAttempt: Date.now(),
                    score
                  }
                },
                lastAccessed: Date.now()
              }
            },
            statistics: {
              ...state.progress.statistics,
              cardsCompleted: state.progress.statistics.cardsCompleted + 
                (cardData.completed ? 0 : 1)
            }
          };

          return { progress: updatedProgress };
        }),

      markCardAttempt: (lessonId, courseId, cardId) =>
        set((state) => {
          const lessonData = state.progress.lessons[lessonId] || {
            completedCourses: [],
            cardProgress: {}
          };

          const cardData = lessonData.cardProgress[cardId] || {
            completed: false,
            attempts: 0,
            lastAttempt: 0
          };

          return {
            progress: {
              ...state.progress,
              lessons: {
                ...state.progress.lessons,
                [lessonId]: {
                  ...lessonData,
                  cardProgress: {
                    ...lessonData.cardProgress,
                    [cardId]: {
                      ...cardData,
                      attempts: cardData.attempts + 1,
                      lastAttempt: Date.now()
                    }
                  }
                }
              }
            }
          };
        }),

      // Course management
      markCourseComplete: (lessonId, courseId) =>
        set((state) => {
          const lessonData = state.progress.lessons[lessonId] || {
            completedCourses: [],
            cardProgress: {}
          };

          if (lessonData.completedCourses.includes(courseId)) {
            return state; // Already completed
          }

          const updatedProgress = {
            ...state.progress,
            lessons: {
              ...state.progress.lessons,
              [lessonId]: {
                ...lessonData,
                completedCourses: [...lessonData.completedCourses, courseId],
                lastAccessed: Date.now()
              }
            },
            statistics: {
              ...state.progress.statistics,
              coursesCompleted: state.progress.statistics.coursesCompleted + 1
            }
          };

          return { progress: updatedProgress };
        }),

      // Check if lesson is complete
      checkLessonComplete: (lessonId) => {
        const state = get();
        const lessonData = state.progress.lessons[lessonId];
        return lessonData?.completedCourses.length >= 4; // Assuming 4 courses per lesson
      },

      // Statistics updates
      updateStudyTime: (milliseconds) =>
        set((state) => ({
          progress: {
            ...state.progress,
            statistics: {
              ...state.progress.statistics,
              totalStudyTime: state.progress.statistics.totalStudyTime + milliseconds
            }
          }
        })),

      updateStreak: () =>
        set((state) => {
          const today = new Date().setHours(0, 0, 0, 0);
          const lastStudy = state.progress.statistics.streak.lastStudyDate;
          const yesterday = today - 24 * 60 * 60 * 1000;

          let newStreak = 1;
          if (lastStudy === yesterday) {
            newStreak = state.progress.statistics.streak.current + 1;
          } else if (lastStudy === today) {
            newStreak = state.progress.statistics.streak.current;
          }

          return {
            progress: {
              ...state.progress,
              statistics: {
                ...state.progress.statistics,
                streak: {
                  current: newStreak,
                  longest: Math.max(newStreak, state.progress.statistics.streak.longest),
                  lastStudyDate: today
                }
              }
            }
          };
        }),

      updateAccuracy: (cardType, correct) =>
        set((state) => {
          const currentAccuracy = state.progress.statistics.accuracy.byCardType[cardType] || 0;
          const currentOverall = state.progress.statistics.accuracy.overall;
          
          // Simple moving average approximation
          const newTypeAccuracy = currentAccuracy * 0.9 + (correct ? 100 : 0) * 0.1;
          const newOverallAccuracy = currentOverall * 0.9 + (correct ? 100 : 0) * 0.1;

          return {
            progress: {
              ...state.progress,
              statistics: {
                ...state.progress.statistics,
                accuracy: {
                  overall: Math.round(newOverallAccuracy),
                  byCardType: {
                    ...state.progress.statistics.accuracy.byCardType,
                    [cardType]: Math.round(newTypeAccuracy)
                  }
                }
              }
            }
          };
        }),

      // Player context management
      setPlayerContext: (context) => set({ playerContext: context }),

      updatePlayerContext: (update) =>
        set((state) => ({
          playerContext: state.playerContext 
            ? { ...state.playerContext, ...update }
            : null
        })),

      // Utility functions
      getCourseProgress: (lessonId, courseId) => {
        const state = get();
        const lessonData = state.progress.lessons[lessonId];
        if (!lessonData) return 0;

        const courseCards = Object.keys(lessonData.cardProgress).filter(
          cardId => cardId.startsWith(`${courseId}-`)
        );
        
        if (courseCards.length === 0) return 0;
        
        const completedCards = courseCards.filter(
          cardId => lessonData.cardProgress[cardId]?.completed
        );

        return Math.round((completedCards.length / courseCards.length) * 100);
      },

      getLessonProgress: (lessonId) => {
        const state = get();
        const lessonData = state.progress.lessons[lessonId];
        if (!lessonData) return 0;

        const totalCards = Object.keys(lessonData.cardProgress).length;
        if (totalCards === 0) return 0;

        const completedCards = Object.values(lessonData.cardProgress).filter(
          card => card.completed
        ).length;

        return Math.round((completedCards / totalCards) * 100);
      },

      isCourseUnlocked: (lessonId, courseId) => {
        const state = get();
        const lessonData = state.progress.lessons[lessonId];
        
        // First course is always unlocked
        if (courseId.endsWith('-1')) return true;
        
        // Check if prerequisite course is completed
        const courseNum = parseInt(courseId.split('-')[1]);
        const prevCourseId = `${lessonId}-${courseNum - 1}`;
        
        return lessonData?.completedCourses.includes(prevCourseId) || false;
      },

      getLastPlayed: () => {
        const state = get();
        return state.progress.lastPlayed || null;
      }
    }),
    {
      name: 'prt-progress',
      storage: dexieStorage as any, // Type compatibility workaround for IndexedDB storage
    }
  )
);

// Selector hooks for better performance
export const useUserSettings = () => useProgress(state => state.progress.settings);
export const useUserStats = () => useProgress(state => state.progress.statistics);
export const usePlayerContext = () => useProgress(state => state.playerContext);