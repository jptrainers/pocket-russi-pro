import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Lock, CheckCircle, BookOpen } from "lucide-react";
import { useProgress } from "@/store/progress";
import { Lesson } from "@/types/content";
import { loadLesson } from "@/lib/content";

const LessonDetail = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const { getCourseProgress, isCourseUnlocked } = useProgress();

  useEffect(() => {
    if (lessonId) {
      loadLesson(lessonId).then(loadedLesson => {
        setLesson(loadedLesson);
        setLoading(false);
      });
    }
  }, [lessonId]);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="h-24">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">レッスンが見つかりませんでした。</p>
            <Button asChild className="mt-4">
              <Link to="/lessons">レッスン一覧に戻る</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link to="/lessons">
          <ArrowLeft className="h-4 w-4 mr-2" />
          レッスン一覧に戻る
        </Link>
      </Button>

      {/* Lesson Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
        <p className="text-lg text-muted-foreground">{lesson.description}</p>
      </div>

      {/* Course List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">コース一覧</h2>
        
        {lesson.courses.map((course, index) => {
          const progress = getCourseProgress(lesson.id, course.id);
          const isUnlocked = isCourseUnlocked(lesson.id, course.id);
          const isCompleted = progress === 100;

          return (
            <Card 
              key={course.id}
              className={`shadow-card transition-smooth ${
                isUnlocked ? 'hover:shadow-elegant hover:scale-[1.01]' : 'opacity-60'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="font-semibold">{course.title}</h3>
                        {course.textbookRef && (
                          <p className="text-sm text-muted-foreground">
                            教科書 {course.textbookRef}
                          </p>
                        )}
                      </div>
                    </CardTitle>
                  </div>
                  <div className="ml-2">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : !isUnlocked ? (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <BookOpen className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">進捗</span>
                    <span className="text-xs text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Card Count */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-muted-foreground">
                    {course.cards.length}枚のカード
                  </span>
                  {isCompleted && (
                    <Badge variant="secondary" className="text-xs">
                      完了
                    </Badge>
                  )}
                  {!isUnlocked && (
                    <Badge variant="outline" className="text-xs">
                      前のコースを完了してください
                    </Badge>
                  )}
                </div>

                {/* Action Button */}
                <Button 
                  variant={!isUnlocked ? "outline" : progress > 0 ? "primary" : "course"}
                  size="sm"
                  className="w-full"
                  disabled={!isUnlocked}
                  asChild={isUnlocked}
                >
                  {!isUnlocked ? (
                    <span>
                      <Lock className="h-4 w-4 mr-2" />
                      ロック中
                    </span>
                  ) : (
                    <Link to={`/lessons/${lesson.id}/${course.id}/player`}>
                      <Play className="h-4 w-4 mr-2" />
                      {progress > 0 ? "続きから" : "開始"}
                    </Link>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LessonDetail;