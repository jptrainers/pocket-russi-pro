import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import Index from "./pages/Index";
import Lessons from "./pages/Lessons";
import LessonDetail from "./pages/LessonDetail";
import CoursePlayer from "./pages/CoursePlayer";
import Cards from "./pages/Cards";
import Basics from "./pages/Basics";
import Settings from "./pages/Settings";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background/95 to-muted/30">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <header className="border-b border-border/20 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
                <div className="flex items-center gap-4 px-4 py-3">
                  <SidebarTrigger className="hover:bg-muted/50 rounded-lg p-2 transition-colors" />
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gradient-primary flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-xs">PR</span>
                    </div>
                    <span className="font-bold gradient-text">Pocket Russian Trainer</span>
                  </div>
                </div>
              </header>
              <main className="flex-1 pb-20">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/lessons" element={<Lessons />} />
                  <Route path="/lessons/:lessonId" element={<LessonDetail />} />
                  <Route path="/lessons/:lessonId/:courseId/player" element={<CoursePlayer />} />
                  <Route path="/cards" element={<Cards />} />
                  <Route path="/basics" element={<Basics />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/about" element={<About />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <BottomNav />
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
