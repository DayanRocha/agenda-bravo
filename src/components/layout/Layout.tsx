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
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border px-4 py-3 flex justify-between items-center">
        <div>
          {title && <h1 className="text-lg font-semibold text-foreground">{title}</h1>}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-primary" />
            {user?.name && <span className="text-sm font-medium">{user.name}</span>}
          </div>
          <Button aria-label="Sair" variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      <TabBar />
    </div>
  );
};