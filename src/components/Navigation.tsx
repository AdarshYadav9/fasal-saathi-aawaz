import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Lightbulb, Bug, TrendingUp, Home, Wifi, WifiOff, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  language: string;
}

export const Navigation = ({ currentView, onViewChange, language }: NavigationProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const isMobile = useIsMobile();

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
        <h2 className="text-sm sm:text-lg font-semibold text-primary flex items-center gap-1 sm:gap-2">
          🌾 {t.smartCropAdvisory}
        </h2>
        <div className="flex items-center gap-2">
          <Badge className={`${isOnline ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'} text-xs sm:text-sm`}>
            {isOnline ? (
              <><Wifi className="w-3 h-3 mr-1" /> {t.online}</>
            ) : (
              <><WifiOff className="w-3 h-3 mr-1" /> {t.offline}</>
            )}
          </Badge>
        </div>
      </div>

      {isMobile ? (
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm" className="w-full text-sm py-2">
              <Menu className="w-4 h-4 mr-2" /> {t.home} 
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="text-lg sm:text-xl">{t.smartCropAdvisory}</DrawerTitle>
            </DrawerHeader>
            <nav className="grid gap-1 sm:gap-2 p-2 sm:p-4">
              {navigationItems.map((item) => (
                <DrawerClose asChild key={item.id}>
                  <Button
                    variant={currentView === item.id ? "field" : "ghost"}
                    className="justify-start gap-2 text-sm sm:text-base py-2"
                    onClick={() => onViewChange(item.id)}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </DrawerClose>
              ))}
            </nav>
          </DrawerContent>
        </Drawer>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-1 sm:gap-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? "field" : "outline"}
              size="sm"
              className="flex items-center gap-1 sm:gap-2 justify-start text-xs sm:text-sm py-2"
              onClick={() => onViewChange(item.id)}
            >
              <item.icon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
};