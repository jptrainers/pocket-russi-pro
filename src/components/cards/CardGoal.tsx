"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Target, ArrowRight } from "lucide-react";
import { CardBase } from "@/types/content";

interface CardGoalProps {
  card: CardBase;
  onNext: () => void;
}

export function CardGoal({ card, onNext }: CardGoalProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-card animate-fade-in">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Target className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-xl font-semibold">{card.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {card.body && (
          <div className="prose prose-sm max-w-none text-center">
            <div dangerouslySetInnerHTML={{ __html: card.body.replace(/\n/g, '<br>') }} />
          </div>
        )}
        
        <div className="flex justify-center pt-4">
          <Button 
            variant="primary" 
            size="lg" 
            onClick={onNext}
            className="shadow-elegant hover:shadow-glow transform hover:scale-105 transition-bounce"
          >
            始める
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}