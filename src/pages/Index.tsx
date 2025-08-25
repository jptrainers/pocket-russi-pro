import { useProgress } from "@/store/progress";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, BookOpen, Target, TrendingUp, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Lesson } from "@/types/content";
import { loadLesson } from "@/lib/content";

const Index = () => {
  const { progress, updateStreak } = useProgress();
  const stats = progress.statistics;
  const [recentLesson, setRecentLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    // Update streak on app open
    updateStreak();

    // Load the last played lesson for continue button
    if (progress.lastPlayed) {
      loadLesson(progress.lastPlayed.lessonId).then(setRecentLesson);
    }
  }, [updateStreak, progress.lastPlayed]);

  const continueLearning = progress.lastPlayed && recentLesson;

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      {/* Hero Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
          Pocket Russian Trainer
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          教科書「これからはじめる ロシア語入門」と連携したマイクロラーニングアプリ
        </p>
        
        {/* Continue Learning Button */}
        {continueLearning ? (
          <Button 
            size="xl" 
            variant="hero" 
            asChild 
            className="shadow-glow hover:scale-105 transform transition-bounce"
          >
            <Link to={`/lessons/${progress.lastPlayed.lessonId}/${progress.lastPlayed.courseId}/player`}>
              <Play className="h-5 w-5" />
              続きから学習
            </Link>
          </Button>
        ) : (
          <Button 
            size="xl" 
            variant="hero" 
            asChild
            className="shadow-glow hover:scale-105 transform transition-bounce"
          >
            <Link to="/lessons">
              <BookOpen className="h-5 w-5" />
              学習を始める
            </Link>
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center shadow-card hover:shadow-elegant transition-smooth">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{stats.cardsCompleted}</div>
            <p className="text-xs text-muted-foreground">カード完了</p>
          </CardContent>
        </Card>
        
        <Card className="text-center shadow-card hover:shadow-elegant transition-smooth">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">{stats.coursesCompleted}</div>
            <p className="text-xs text-muted-foreground">コース完了</p>
          </CardContent>
        </Card>
        
        <Card className="text-center shadow-card hover:shadow-elegant transition-smooth">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-accent">{stats.streak.current}</div>
            <p className="text-xs text-muted-foreground">連続日数</p>
          </CardContent>
        </Card>
        
        <Card className="text-center shadow-card hover:shadow-elegant transition-smooth">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">{Math.round(stats.accuracy.overall)}%</div>
            <p className="text-xs text-muted-foreground">正答率</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {continueLearning && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              最近の学習
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{recentLesson.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {recentLesson.courses.find(c => c.id === progress.lastPlayed?.courseId)?.title}
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to={`/lessons/${progress.lastPlayed.lessonId}`}>
                  詳細を見る
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="shadow-card hover:shadow-elegant transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              レッスン
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              教科書に沿った22のレッスンを順番に学習
            </p>
            <Button variant="primary" asChild className="w-full">
              <Link to="/lessons">
                レッスン一覧へ
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-elegant transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              単語カード
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              間隔反復学習で効率的に語彙を記憶
            </p>
            <Button variant="accent" asChild className="w-full">
              <Link to="/cards">
                単語練習へ
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Motivational Message */}
      <Card className="bg-gradient-subtle border-none shadow-card">
        <CardContent className="pt-6 text-center">
          <div className="mb-4">
            {stats.streak.current > 0 ? (
              <>
                <span className="text-2xl">🔥</span>
                <p className="text-sm text-muted-foreground mt-2">
                  {stats.streak.current}日連続で学習中！その調子で頑張りましょう！
                </p>
              </>
            ) : (
              <>
                <span className="text-2xl">🎯</span>
                <p className="text-sm text-muted-foreground mt-2">
                  今日から学習を始めて、連続記録を作りましょう！
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
