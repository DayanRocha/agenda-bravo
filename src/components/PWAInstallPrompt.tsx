import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, X } from 'lucide-react';

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as any).standalone === true;

    if (!isStandalone) {
      // Show prompt after a delay
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleInstall = async () => {
    if ((window as any).showInstallPrompt) {
      await (window as any).showInstallPrompt();
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if user has dismissed it before
  if (localStorage.getItem('pwa-install-dismissed') === 'true') {
    return null;
  }

  if (!showPrompt) return null;

  return (
    <Card className="fixed bottom-20 left-4 right-4 p-4 shadow-lg border-primary z-50">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Download className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Instalar Agenda Bravo</h3>
            <p className="text-xs text-muted-foreground">
              {isIOS 
                ? 'Toque em "Compartilhar" e depois "Adicionar à Tela Inicial"'
                : 'Instale o app para acesso rápido e uso offline'
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isIOS && (
            <Button size="sm" onClick={handleInstall}>
              Instalar
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}