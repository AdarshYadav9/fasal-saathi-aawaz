import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Lightbulb, Bug, TrendingUp, Home, Wifi, WifiOff } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  language: string;
}

export const Navigation = ({ currentView, onViewChange, language }: NavigationProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const translations = {
    en: {
      home: 'Home',
      chatbot: 'AI Assistant',
      recommendations: 'Crop Advice',
      pestDetection: 'Pest Detection',
      marketPrices: 'Market Prices',
      online: 'Online',
      offline: 'Offline',
      smartCropAdvisory: 'Smart Crop Advisory'
    },
    hi: {
      home: 'होम',
      chatbot: 'AI सहायक',
      recommendations: 'फसल सलाह',
      pestDetection: 'कीट पहचान',
      marketPrices: 'बाजार भाव',
      online: 'ऑनलाइन',
      offline: 'ऑफलाइन',
      smartCropAdvisory: 'स्मार्ट फसल सलाहकार'
    },
    pa: {
      home: 'ਘਰ',
      chatbot: 'AI ਸਹਾਇਕ',
      recommendations: 'ਫਸਲ ਸਲਾਹ',
      pestDetection: 'ਕੀੜੇ ਪਛਾਣ',
      marketPrices: 'ਬਾਜ਼ਾਰ ਭਾਅ',
      online: 'ਔਨਲਾਈਨ',
      offline: 'ਔਫਲਾਈਨ',
      smartCropAdvisory: 'ਸਮਾਰਟ ਫਸਲ ਸਲਾਹਕਾਰ'
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const navigationItems = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'chatbot', label: t.chatbot, icon: MessageCircle },
    { id: 'recommendations', label: t.recommendations, icon: Lightbulb },
    { id: 'pest-detection', label: t.pestDetection, icon: Bug },
    { id: 'market-prices', label: t.marketPrices, icon: TrendingUp },
  ];

  return (
    <Card className="p-4 shadow-medium mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
          🌾 {t.smartCropAdvisory}
        </h2>
        <Badge className={`${isOnline ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'}`}>
          {isOnline ? (
            <><Wifi className="w-3 h-3 mr-1" /> {t.online}</>
          ) : (
            <><WifiOff className="w-3 h-3 mr-1" /> {t.offline}</>
          )}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant={currentView === item.id ? "field" : "outline"}
            size="sm"
            className="flex items-center gap-2 justify-start"
            onClick={() => onViewChange(item.id)}
          >
            <item.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{item.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
};