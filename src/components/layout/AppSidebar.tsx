import { Home, BookOpen, CreditCard, Archive, Settings, Info, ChevronRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "ホーム",
    url: "/",
    icon: Home,
  },
  {
    title: "レッスン一覧 (1課〜22課)",
    url: "/lessons", 
    icon: BookOpen,
  },
  {
    title: "単語トレーニング",
    url: "/cards",
    icon: CreditCard,
  },
  {
    title: "基礎トレーニング", 
    url: "/basics",
    icon: Archive,
  },
  {
    title: "設定と記録",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "このアプリについて",
    url: "/about", 
    icon: Info,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Sidebar className="border-r border-border/20">
      <SidebarHeader className="border-b border-border/20 p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">PR</span>
          </div>
          <span className="font-bold text-lg gradient-text">Pocket Russian</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground px-4 py-2 text-sm font-medium">
            メニュー
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = currentPath === item.url || 
                  (item.url === "/lessons" && currentPath.startsWith("/lessons"));
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      className={`group transition-all duration-200 hover:shadow-elegant ${
                        isActive 
                          ? "bg-primary/10 text-primary border-r-2 border-primary shadow-elegant" 
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <NavLink 
                        to={item.url}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg w-full"
                      >
                        <item.icon className={`h-5 w-5 transition-colors ${
                          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                        }`} />
                        <span className={`flex-1 text-sm font-medium transition-colors ${
                          isActive ? "text-primary" : "text-foreground"
                        }`}>
                          {item.title}
                        </span>
                        <ChevronRight className={`h-4 w-4 transition-all ${
                          isActive 
                            ? "text-primary transform rotate-90" 
                            : "text-muted-foreground/50 group-hover:text-muted-foreground group-hover:transform group-hover:translate-x-1"
                        }`} />
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}