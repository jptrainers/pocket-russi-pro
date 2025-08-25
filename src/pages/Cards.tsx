import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { CreditCard, BookOpen, Target } from "lucide-react";
import { Link } from "react-router-dom";

const Cards = () => {
  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold mb-2">単語カード</h1>
        <p className="text-muted-foreground">
          間隔反復学習で効率的にロシア語の語彙を覚えましょう
        </p>
      </div>

      {/* Coming Soon */}
      <Card className="shadow-card">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <CreditCard className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">近日公開</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              単語カード機能は現在開発中です。間隔反復学習アルゴリズムを使用した効率的な語彙学習機能を追加予定です。
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">予定されている機能：</h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                間隔反復学習 (SRS)
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                レッスン連携
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                カスタム単語帳
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                習熟度追跡
              </div>
            </div>
          </div>

          <Button asChild className="mt-6">
            <Link to="/lessons">
              レッスンで学習を続ける
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cards;