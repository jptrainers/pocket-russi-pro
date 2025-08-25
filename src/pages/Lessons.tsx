import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Lock, CheckCircle, Play } from "lucide-react";
import { useProgress } from "@/store/progress";
import { Lesson } from "@/types/content";
import { loadAllLessons } from "@/lib/content";

const Lessons = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const { getLessonProgress, checkLessonComplete } = useProgress();

  useEffect(() => {
    loadAllLessons().then(loadedLessons => {
      setLessons(loadedLessons);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-32">
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

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold mb-2">レッスン一覧</h1>
        <p className="text-muted-foreground">
          教科書に沿った22のレッスンを順番に学習しましょう
        </p>
      </div>

      {/* Lessons Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => {
          const progress = getLessonProgress(lesson.id);
          const isCompleted = checkLessonComplete(lesson.id);
          const isLocked = lesson.id !== "1" && getLessonProgress((parseInt(lesson.id) - 1).toString()) < 80;

          return (
            <Card 
              key={lesson.id} 
              className={`shadow-card hover:shadow-elegant transition-smooth ${
                isLocked ? 'opacity-60' : 'hover:scale-[1.02]'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold line-clamp-2">
                      {lesson.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {lesson.description}
                    </p>
                  </div>
                  <div className="ml-2">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : isLocked ? (
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

                {/* Course Count */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-muted-foreground">
                    {lesson.courses.length}コース
                  </span>
                  {isCompleted && (
                    <Badge variant="secondary" className="text-xs">
                      完了
                    </Badge>
                  )}
                </div>

                {/* Action Button */}
                <Button 
                  variant={isLocked ? "outline" : progress > 0 ? "primary" : "lesson"}
                  size="sm"
                  className="w-full"
                  disabled={isLocked}
                  asChild={!isLocked}
                >
                  {isLocked ? (
                    <span>
                      <Lock className="h-4 w-4 mr-2" />
                      ロック中
                    </span>
                  ) : (
                    <Link to={`/lessons/${lesson.id}`}>
                      {progress > 0 ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          続きから
                        </>
                      ) : (
                        <>
                          <BookOpen className="h-4 w-4 mr-2" />
                          開始
                        </>
                      )}
                    </Link>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progress Summary */}
      <Card className="mt-8 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            学習進捗サマリー
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {lessons.filter(l => checkLessonComplete(l.id)).length}
              </div>
              <p className="text-xs text-muted-foreground">完了レッスン</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {lessons.filter(l => getLessonProgress(l.id) > 0 && !checkLessonComplete(l.id)).length}
              </div>
              <p className="text-xs text-muted-foreground">進行中</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-muted-foreground">
                {lessons.filter(l => getLessonProgress(l.id) === 0).length}
              </div>
              <p className="text-xs text-muted-foreground">未開始</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Lessons;