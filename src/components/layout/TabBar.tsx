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
    <nav aria-label="Navegação principal" className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-t border-border z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={cn(
                "relative flex flex-col items-center justify-center h-14 px-2 transition-colors duration-200",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon 
                size={20}
                className="mb-1"
              />
              <span className="text-xs font-medium">{tab.label}</span>
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};