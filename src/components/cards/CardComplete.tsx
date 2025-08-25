"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { CardBase } from "@/types/content";

interface CardCompleteProps {
  card: CardBase;
  onNext: () => void;
}

export function CardComplete({ card, onNext }: CardCompleteProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-card animate-fade-in">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4 animate-success-bounce">
          <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-accent">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          {card.title || "完了！"}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 text-center">
        {card.body && (
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: card.body.replace(/\n/g, '<br>') }} />
          </div>
        )}
        
        <div className="flex justify-center pt-4">
          <Button 
            variant="hero" 
            size="xl" 
            onClick={onNext}
            className="shadow-glow hover:shadow-elegant transform hover:scale-105 transition-bounce"
          >
            次のレッスンへ
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}