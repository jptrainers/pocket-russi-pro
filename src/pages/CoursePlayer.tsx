import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/enhanced-button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useProgress } from "@/store/progress";
import { Lesson, MicroCourse, CardBase, PlayerState } from "@/types/content";
import { loadLesson, getNextCard, getPreviousCard } from "@/lib/content";
import { CardGoal } from "@/components/cards/CardGoal";
import { CardMcq } from "@/components/cards/CardMcq";
import { CardComplete } from "@/components/cards/CardComplete";

const CoursePlayer = () => {
  const { lessonId, courseId } = useParams<{ lessonId: string; courseId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<MicroCourse | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [playerState, setPlayerState] = useState<PlayerState>("loading");
  const { markCardComplete, markCourseComplete } = useProgress();

  useEffect(() => {
    if (lessonId && courseId) {
      loadLesson(lessonId).then(loadedLesson => {
        if (loadedLesson) {
          const foundCourse = loadedLesson.courses.find(c => c.id === courseId);
          setLesson(loadedLesson);
          setCourse(foundCourse || null);
          setPlayerState(foundCourse ? "ready" : "loading");
        }
      });
    }
  }, [lessonId, courseId]);

  const currentCard = course?.cards[currentCardIndex];
  const progress = course ? Math.round(((currentCardIndex + 1) / course.cards.length) * 100) : 0;

  const handleNext = () => {
    if (!course || !lesson || !currentCard) return;

    // Mark current card as complete
    markCardComplete(lesson.id, course.id, currentCard.id);

    // Check if this is the last card
    if (currentCardIndex >= course.cards.length - 1) {
      // Course completed
      markCourseComplete(lesson.id, course.id);
      navigate(`/lessons/${lesson.id}`);
      return;
    }

    // Move to next card
    setCurrentCardIndex(prev => prev + 1);
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    }
  };

  const handleExit = () => {
    if (lessonId) {
      navigate(`/lessons/${lessonId}`);
    } else {
      navigate('/lessons');
    }
  };

  if (playerState === "loading" || !course || !currentCard) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">読み込み中...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderCard = () => {
    switch (currentCard.type) {
      case "goal":
        return <CardGoal card={currentCard} onNext={handleNext} />;
      case "mcq":
        return <CardMcq card={currentCard} onNext={handleNext} onAnswer={(correct) => {
          // Handle answer feedback
        }} />;
      case "complete":
        return <CardComplete card={currentCard} onNext={handleNext} />;
      default:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">{currentCard.title}</h2>
              <p className="text-muted-foreground mb-6">
                このカード種類はまだ実装されていません: {currentCard.type}
              </p>
              <Button onClick={handleNext}>次へ</Button>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={handleExit}>
              <X className="h-5 w-5" />
            </Button>
            
            <div className="flex-1 mx-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{course.title}</span>
                <span className="text-sm text-muted-foreground">
                  {currentCardIndex + 1} / {course.cards.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="text-sm font-medium text-primary">
              {progress}%
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="animate-fade-in">
          {renderCard()}
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-20 left-0 right-0 bg-background/95 backdrop-blur border-t border-border">
        <div className="container max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentCardIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              前へ
            </Button>

            <div className="flex items-center gap-2">
              {course.cards.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentCardIndex 
                      ? "bg-primary" 
                      : index < currentCardIndex 
                        ? "bg-success" 
                        : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <Button 
              variant="primary" 
              onClick={handleNext}
            >
              次へ
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;