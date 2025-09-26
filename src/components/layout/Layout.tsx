import { ReactNode } from "react";
import { TabBar } from "./TabBar";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export const Layout = ({ children, title }: LayoutProps) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background pb-20 relative">
      {/* Animated background gradient */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 neon-bg opacity-50"></div>
      </div>
      
      {/* Header */}
      <header className="sticky top-0 z-40 neon-border bg-card/90 backdrop-blur-md supports-[backdrop-filter]:bg-card/80 px-4 py-3 flex justify-between items-center shadow-card">
        <div>
          {title && <h1 className="text-lg font-semibold neon-text">{title}</h1>}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-primary drop-shadow-[0_0_5px_hsl(var(--primary)/0.5)]" />
            {user?.name && <span className="text-sm font-medium text-foreground/90">{user.name}</span>}
          </div>
          <Button aria-label="Sair" variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>
      
      <main className="flex-1 relative z-10">
        {children}
      </main>
      <TabBar />
    </div>
  );
};