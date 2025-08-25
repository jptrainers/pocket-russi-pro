// Content loading and management utilities

import { Lesson, ContentManifest, validateLesson, validateContentManifest } from '@/lib/schema';

// Mock content for demo - in production this would load from API or local files
export async function loadLesson(lessonId: string): Promise<Lesson | null> {
  try {
    // For now, we'll use the lesson-01 data as a template
    if (lessonId === "1") {
      const response = await fetch('/content/lesson-01.json');
      if (!response.ok) {
        // Fallback to inline data if file not found
        return mockLesson01;
      }
      const data = await response.json();
      return validateLesson(data);
    }
    
    // Generate mock lessons for demo
    return generateMockLesson(lessonId);
  } catch (error) {
    console.error(`Error loading lesson ${lessonId}:`, error);
    return null;
  }
}

export async function loadAllLessons(): Promise<Lesson[]> {
  const lessons: Lesson[] = [];
  
  // Load lessons 1-22
  for (let i = 1; i <= 22; i++) {
    const lesson = await loadLesson(i.toString());
    if (lesson) {
      lessons.push(lesson);
    }
  }
  
  return lessons;
}

export function getCourseById(lesson: Lesson, courseId: string) {
  return lesson.courses.find(course => course.id === courseId);
}

export function getCardById(lesson: Lesson, courseId: string, cardId: string) {
  const course = getCourseById(lesson, courseId);
  return course?.cards.find(card => card.id === cardId);
}

export function getNextCard(lesson: Lesson, courseId: string, currentCardId: string) {
  const course = getCourseById(lesson, courseId);
  if (!course) return null;
  
  const currentIndex = course.cards.findIndex(card => card.id === currentCardId);
  if (currentIndex === -1 || currentIndex === course.cards.length - 1) return null;
  
  return course.cards[currentIndex + 1];
}

export function getPreviousCard(lesson: Lesson, courseId: string, currentCardId: string) {
  const course = getCourseById(lesson, courseId);
  if (!course) return null;
  
  const currentIndex = course.cards.findIndex(card => card.id === currentCardId);
  if (currentIndex <= 0) return null;
  
  return course.cards[currentIndex - 1];
}

// Mock lesson data
const mockLesson01: Lesson = {
  id: "1",
  title: "第1課　これは何ですか？",
  description: "基本的な指示代名詞と疑問文の使い方を学習します",
  courses: [
    {
      id: "1-1",
      title: "はじめに (導入)",
      textbookRef: "p.20-21",
      cards: [
        {
          id: "goal-1",
          type: "goal",
          title: "この課で学ぶこと",
          body: "## これができるようになります！\n\n✓ 身近なものについて「これは何ですか？」と質問できる\n\n✓ 「これは〜です」と答えることができる\n\n✓ 基本的な挨拶と自己紹介ができる",
          imagePrompt: "Russian classroom setting with textbooks and learning materials"
        },
        {
          id: "listening-1", 
          type: "listening",
          title: "会話を聞いてみましょう",
          body: "まずは音声を聞いて、どんな会話か想像してみてください。",
          audioSrc: "/audio/lesson-01/intro-conversation.mp3",
          imagePrompt: "Two people having a conversation in Russian"
        },
        {
          id: "phrase-1",
          type: "phrase", 
          title: "基本フレーズ：これは何ですか？",
          body: "**Что это?** \n\n[シト エータ]\n\n意味：これは何ですか？",
          audioSrc: "/audio/lesson-01/chto-eto.mp3",
          imagePrompt: "Person pointing at an object asking what it is"
        },
        {
          id: "mcq-1",
          type: "mcq",
          title: "理解度チェック",
          body: "「これは何ですか？」をロシア語で言うと？",
          options: [
            "Это что?",
            "Что это?", 
            "Как это?"
          ],
          answer: 1,
          explanation: "「Что это?」が正解です。「что」は「何」、「это」は「これ」を意味します。"
        }
      ]
    },
    {
      id: "1-2", 
      title: "ポイント① 指示代名詞「это」",
      textbookRef: "p.22",
      prerequisite: "1-1",
      cards: [
        {
          id: "grammar-1",
          type: "grammar",
          title: "文法ポイント：это の使い方",
          body: "## 指示代名詞「это」\n\n**это** は「これ、それ、あれ」を表す万能な指示代名詞です。\n\n### 基本的な使い方\n- **Это книга.** (これは本です)\n- **Это стол.** (これは机です)\n- **Что это?** (これは何ですか？)",
          imagePrompt: "Grammar explanation diagram showing это pointing to various objects"
        },
        {
          id: "mcq-2",
          type: "mcq", 
          title: "練習問題",
          body: "「これは椅子です」をロシア語で言うと？",
          options: [
            "Это стул.",
            "Это стол.", 
            "Это окно."
          ],
          answer: 0,
          explanation: "「стул」が椅子という意味なので、「Это стул.」が正解です。"
        }
      ]
    }
  ]
};

// Generate mock lessons for demo purposes
function generateMockLesson(lessonId: string): Lesson {
  const lessonNumber = parseInt(lessonId);
  return {
    id: lessonId,
    title: `第${lessonNumber}課　レッスン${lessonNumber}`,
    description: `第${lessonNumber}課の学習内容です。`,
    courses: [
      {
        id: `${lessonId}-1`,
        title: "はじめに (導入)",
        textbookRef: `p.${20 + (lessonNumber - 1) * 10}`,
        cards: [
          {
            id: `goal-${lessonId}`,
            type: "goal",
            title: "この課で学ぶこと",
            body: `## 第${lessonNumber}課の学習目標\n\n新しい文法と表現を学習します。`,
            imagePrompt: "Russian language learning materials"
          },
          {
            id: `mcq-${lessonId}`,
            type: "mcq",
            title: "練習問題",
            body: "基本的な練習問題です。",
            options: ["選択肢1", "選択肢2", "選択肢3"],
            answer: 0,
            explanation: "これは説明文です。"
          },
          {
            id: `complete-${lessonId}`,
            type: "complete",
            title: "完了！",
            body: "このコースを完了しました！",
            imagePrompt: "Celebration scene with achievement"
          }
        ]
      }
    ]
  };
}