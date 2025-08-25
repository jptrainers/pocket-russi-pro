"use client";

import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, CreditCard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/",
    label: "ホーム", 
    icon: Home,
  },
  {
    href: "/lessons",
    label: "レッスン",
    icon: BookOpen,
  },
  {
    href: "/cards",
    label: "単語カード",
    icon: CreditCard,
  },
  {
    href: "/settings",
    label: "設定",
    icon: Settings,
  },
];

export function BottomNav() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-pb">
      <div className="container max-w-screen-2xl px-4">
        <div className="flex h-16 items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-smooth",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="text-[10px] leading-none">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}