import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { BookOpen, Heart, Github, Mail, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <div className="mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-primary mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Pocket Russian Trainer</h1>
        <p className="text-muted-foreground">
          ロシア語学習のためのマイクロラーニングアプリ
        </p>
      </div>

      {/* About the App */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>このアプリについて</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed">
            Pocket Russian Trainerは、教科書「これからはじめる ロシア語入門」に完全対応した
            個人学習用のデジタルコンパニオンアプリです。
          </p>
          
          <div className="space-y-3">
            <h3 className="font-semibold">主な特徴</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                教科書の各課を小さなマイクロコースに分割
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                カード形式の学習で短時間での集中学習が可能
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                完全オフライン動作でいつでもどこでも学習
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                進捗追跡と学習統計で継続をサポート
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                アカウント不要で個人のデバイスに全データを保存
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* How to Use */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>使い方</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold">1. レッスンを選択</h4>
              <p className="text-muted-foreground">
                教科書の課に対応したレッスンを選択します
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">2. コースを学習</h4>
              <p className="text-muted-foreground">
                各レッスンは複数のマイクロコースに分かれています
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">3. カードで練習</h4>
              <p className="text-muted-foreground">
                目標確認、聞き取り、文法、クイズなどのカードで学習
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">4. 進捗を確認</h4>
              <p className="text-muted-foreground">
                学習の進捗と統計を確認して継続をサポート
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>技術仕様</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold">フロントエンド</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• React 19</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• Radix UI</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">データ管理</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• IndexedDB (Dexie)</li>
                <li>• Zustand (状態管理)</li>
                <li>• PWA対応</li>
                <li>• オフライン動作</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>プライバシーとセキュリティ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Heart className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">完全にプライベート</p>
                <p className="text-muted-foreground">
                  すべての学習データはあなたのデバイス内にのみ保存されます
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <BookOpen className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">アカウント不要</p>
                <p className="text-muted-foreground">
                  個人情報の登録や外部サーバーへのデータ送信は一切ありません
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credits */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>クレジット</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm space-y-2">
            <p>
              <strong>教科書:</strong> 「これからはじめる ロシア語入門」
            </p>
            <p className="text-muted-foreground">
              このアプリは上記教科書の学習をサポートするために開発されました。
              教科書の内容については出版社および著者の著作権に従ってください。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="primary" asChild>
          <Link to="/lessons">
            <BookOpen className="h-4 w-4 mr-2" />
            学習を始める
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/settings">
            設定を確認する
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default About;