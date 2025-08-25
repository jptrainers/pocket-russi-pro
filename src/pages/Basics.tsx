import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/enhanced-button";
import { BookOpen, Clock, Star, TrendingUp } from "lucide-react";

export default function Basics() {
  const basicTrainingModes = [
    {
      id: "alphabet",
      title: "ロシア語アルファベット",
      description: "キリル文字の読み方と書き方を基礎から学習",
      level: "初級",
      duration: "15分",
      progress: 85,
      icon: "А",
    },
    {
      id: "pronunciation", 
      title: "発音練習",
      description: "ロシア語特有の音の発音を集中練習",
      level: "初級",
      duration: "20分", 
      progress: 60,
      icon: "🔊",
    },
    {
      id: "numbers",
      title: "数字とカウント",
      description: "1から100までの数字と基本的な数え方",
      level: "初級",
      duration: "10分",
      progress: 40,
      icon: "123",
    },
    {
      id: "greetings",
      title: "基本挨拶",
      description: "日常的な挨拶と礼儀表現を学習",
      level: "初級", 
      duration: "12分",
      progress: 90,
      icon: "👋",
    },
    {
      id: "cases",
      title: "格変化入門",
      description: "ロシア語の格システムの基礎理解",
      level: "中級",
      duration: "25分",
      progress: 20,
      icon: "📝",
    },
    {
      id: "verbs",
      title: "動詞活用",
      description: "基本的な動詞の現在形活用パターン",
      level: "中級",
      duration: "30分", 
      progress: 15,
      icon: "⚡",
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "初級":
        return "bg-success/10 text-success border-success/20";
      case "中級":
        return "bg-warning/10 text-warning border-warning/20";
      case "上級":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-success";
    if (progress >= 50) return "bg-warning";
    return "bg-primary";
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">基礎トレーニング</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          ロシア語の基礎スキルを集中的に鍛える特別プログラムです。文字、発音、文法の基本要素を段階的に習得できます。
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {basicTrainingModes.map((mode) => (
          <Card key={mode.id} className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-muted/20 flex items-center justify-center text-2xl">
                  {mode.icon}
                </div>
                <Badge variant="outline" className={getLevelColor(mode.level)}>
                  {mode.level}
                </Badge>
              </div>
              <CardTitle className="text-xl">{mode.title}</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                {mode.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {mode.duration}
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  {mode.progress}%
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">進捗</span>
                  <span className="font-medium">{mode.progress}%</span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${getProgressColor(mode.progress)}`}
                    style={{ width: `${mode.progress}%` }}
                  />
                </div>
              </div>

              <Button 
                variant={mode.progress > 0 ? "primary" : "outline"}
                size="lg"
                className="w-full group-hover:shadow-elegant transition-all duration-200"
              >
                {mode.progress > 0 ? "続きから" : "開始する"}
                {mode.progress >= 100 && (
                  <Star className="h-4 w-4 ml-2 text-success" />
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Card className="inline-block p-6 bg-gradient-subtle">
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center">
              <Star className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold">学習のコツ</h3>
            <p className="text-muted-foreground max-w-md">
              基礎トレーニングは毎日少しずつ続けることが効果的です。まずはアルファベットと発音から始めて、慣れてきたら文法に挑戦しましょう。
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}