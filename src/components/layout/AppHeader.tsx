"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, BookOpen, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/enhanced-button";
import { useUserStats, useProgress } from "@/store/progress";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onMenuToggle?: (isOpen: boolean) => void;
}

export function AppHeader({ title = "Pocket Russian", showBack = false, onMenuToggle }: AppHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const stats = useUserStats();
  const { progress } = useProgress();

  const toggleMenu = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    onMenuToggle?.(newState);
  };

  const streakDays = stats.streak.current;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        {/* Left side - Menu/Back button */}
        <div className="flex items-center gap-3">
          {showBack ? (
          <Button variant="ghost" size="icon" asChild>
            <Link to="/" aria-label="戻る">
              <X className="h-5 w-5" />
            </Link>
          </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              aria-label="メニュー"
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          {/* App title */}
          <Link to="/" className="flex items-center gap-2 transition-smooth hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="hidden font-bold cyrillic-text sm:inline-block">
              {title}
            </span>
          </Link>
        </div>

        {/* Center - Current lesson/course info */}
        {progress.lastPlayed && (
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <span>第{progress.lastPlayed.lessonId}課</span>
            <span className="text-xs">•</span>
            <span>{progress.lastPlayed.courseId}</span>
          </div>
        )}

        {/* Right side - Stats and settings */}
        <div className="flex items-center gap-2">
          {/* Streak counter */}
          {streakDays > 0 && (
            <div className="hidden sm:flex items-center gap-1 rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent">
              <span>🔥</span>
              <span>{streakDays}日連続</span>
            </div>
          )}

          {/* Settings button */}
          <Button variant="ghost" size="icon" asChild>
            <Link to="/settings" aria-label="設定">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="fixed left-0 top-0 z-50 h-full w-80 border-r border-border bg-background p-6 shadow-lg animate-slide-in">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-bold">Pocket Russian</span>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleMenu}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="space-y-2">
                <Link 
                  to="/"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-smooth hover:bg-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BookOpen className="h-4 w-4" />
                  ホーム
                </Link>
                <Link 
                  to="/lessons"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-smooth hover:bg-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📚 レッスン一覧
                </Link>
                <Link 
                  to="/cards"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-smooth hover:bg-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🃏 単語カード
                </Link>
                <Link 
                  to="/settings"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-smooth hover:bg-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ⚙️ 設定
                </Link>
                <Link 
                  to="/about"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-smooth hover:bg-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ℹ️ このアプリについて
                </Link>
              </nav>

              {/* Stats in mobile menu */}
              <div className="mt-8 space-y-4 border-t border-border pt-4">
                <div className="text-sm font-medium">学習統計</div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg bg-muted p-3">
                    <div className="font-medium">{stats.cardsCompleted}</div>
                    <div className="text-muted-foreground">カード完了</div>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <div className="font-medium">{streakDays}日</div>
                    <div className="text-muted-foreground">連続学習</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}