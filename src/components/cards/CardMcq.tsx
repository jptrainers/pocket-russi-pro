"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { CheckCircle, X, ArrowRight } from "lucide-react";
import { CardBase } from "@/types/content";

interface CardMcqProps {
  card: CardBase;
  onNext: () => void;
  onAnswer?: (correct: boolean) => void;
}

export function CardMcq({ card, onNext, onAnswer }: CardMcqProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowFeedback(true);
    const isCorrect = index === card.answer;
    onAnswer?.(isCorrect);
  };

  const isCorrect = selectedAnswer === card.answer;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-card animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold">{card.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {card.body && (
          <p className="text-center text-lg cyrillic-text">{card.body}</p>
        )}
        
        <div className="space-y-3">
          {card.options?.map((option, index) => (
            <Button
              key={index}
              variant={
                showFeedback
                  ? index === card.answer
                    ? "success"
                    : index === selectedAnswer
                      ? "destructive" 
                      : "outline"
                  : selectedAnswer === index
                    ? "primary"
                    : "outline"
              }
              size="card"
              className="w-full text-left justify-start"
              onClick={() => !showFeedback && handleAnswerSelect(index)}
              disabled={showFeedback}
            >
              <div className="flex items-center gap-3 w-full">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="cyrillic-text flex-1">{option}</span>
                {showFeedback && index === card.answer && (
                  <CheckCircle className="h-5 w-5 text-success-foreground" />
                )}
                {showFeedback && index === selectedAnswer && index !== card.answer && (
                  <X className="h-5 w-5 text-destructive-foreground" />
                )}
              </div>
            </Button>
          ))}
        </div>

        {showFeedback && (
          <div className={`p-4 rounded-lg ${isCorrect ? 'bg-success/10' : 'bg-destructive/10'}`}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <CheckCircle className="h-5 w-5 text-success" />
              ) : (
                <X className="h-5 w-5 text-destructive" />
              )}
              <span className="font-semibold">
                {isCorrect ? "正解！" : "不正解"}
              </span>
            </div>
            {card.explanation && (
              <p className="text-sm text-muted-foreground">{card.explanation}</p>
            )}
          </div>
        )}
        
        {showFeedback && (
          <div className="flex justify-center pt-4">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={onNext}
            >
              次へ
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}