import { Calendar, Plus, BarChart3, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "agenda", label: "Agenda", icon: Calendar, path: "/" },
  { id: "novo", label: "Novo", icon: Plus, path: "/novo-registro" },
  { id: "relatorios", label: "Relatórios", icon: BarChart3, path: "/relatorios" },
  { id: "config", label: "Config", icon: Settings, path: "/configuracoes" },
];

export const TabBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav aria-label="Navegação principal" className="fixed bottom-0 left-0 right-0 neon-border bg-card/90 backdrop-blur-md supports-[backdrop-filter]:bg-card/80 z-50 pb-[env(safe-area-inset-bottom)] shadow-card">
      <div className="grid grid-cols-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={cn(
                "relative flex flex-col items-center justify-center h-14 px-2 transition-glow duration-300",
                isActive 
                  ? "text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)]" 
                  : "text-muted-foreground hover:text-primary hover:drop-shadow-[0_0_5px_hsl(var(--primary)/0.4)]"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon 
                size={20}
                className="mb-1"
              />
              <span className="text-xs font-medium">{tab.label}</span>
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full neon-glow" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};