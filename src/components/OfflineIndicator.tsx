import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { WifiOff, Wifi } from 'lucide-react';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <Card className="fixed top-4 left-4 right-4 p-3 bg-destructive/10 border-destructive z-50">
      <div className="flex items-center space-x-3">
        <WifiOff className="h-4 w-4 text-destructive" />
        <div>
          <p className="text-sm font-medium text-destructive">
            Sem conexão com a internet
          </p>
          <p className="text-xs text-destructive/80">
            Você pode continuar usando o app offline
          </p>
        </div>
      </div>
    </Card>
  );
}