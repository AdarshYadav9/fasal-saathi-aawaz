import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Lightbulb, Bug, TrendingUp, Sun, CloudRain, Thermometer } from 'lucide-react';

interface DashboardProps {
  language: string;
  onNavigate: (view: string) => void;
}

export const Dashboard = ({ language, onNavigate }: DashboardProps) => {
  const translations = {
    en: {
      welcome: 'Welcome to Smart Crop Advisory',
      subtitle: 'Your AI-powered farming companion for better crop decisions',
      quickActions: 'Quick Actions',
      todaysWeather: "Today's Weather",
      recentUpdates: 'Recent Updates',
      getStarted: 'Get Started',
      askAI: 'Ask AI Assistant',
      getCropAdvice: 'Get Crop Advice',
      detectPests: 'Detect Pests',
      checkPrices: 'Check Market Prices',
      weatherLocation: 'New Delhi, India',
      temperature: '28°C',
      condition: 'Partly Cloudy',
      humidity: 'Humidity: 65%',
      rainfall: 'Rainfall: 2mm',
      updates: [
        'Market prices updated for wheat and rice',
        'New pest alert: Watch for aphids in mustard crops',
        'Weather forecast: Good week for sowing season'
      ]
    },
    hi: {
      welcome: 'स्मार्ट फसल सलाहकार में स्वागत है',
      subtitle: 'बेहतर फसल निर्णयों के लिए आपका AI-संचालित कृषि साथी',
      quickActions: 'त्वरित कार्य',
      todaysWeather: 'आज का मौसम',
      recentUpdates: 'हाल की अपडेट',
      getStarted: 'शुरू करें',
      askAI: 'AI सहायक से पूछें',
      getCropAdvice: 'फसल सलाह प्राप्त करें',
      detectPests: 'कीट पहचानें',
      checkPrices: 'बाजार भाव देखें',
      weatherLocation: 'नई दिल्ली, भारत',
      temperature: '28°C',
      condition: 'आंशिक बादल',
      humidity: 'नमी: 65%',
      rainfall: 'बारिश: 2mm',
      updates: [
        'गेहूं और चावल के बाजार भाव अपडेट हुए',
        'नई कीट चेतावनी: सरसों की फसल में एफिड्स पर नजर रखें',
        'मौसम पूर्वानुमान: बुवाई के मौसम के लिए अच्छा सप्ताह'
      ]
    },
    pa: {
      welcome: 'ਸਮਾਰਟ ਫਸਲ ਸਲਾਹਕਾਰ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ',
      subtitle: 'ਬਿਹਤਰ ਫਸਲ ਫੈਸਲਿਆਂ ਲਈ ਤੁਹਾਡਾ AI-ਸੰਚਾਲਿਤ ਖੇਤੀ ਸਾਥੀ',
      quickActions: 'ਤੁਰੰਤ ਕਾਰਵਾਈਆਂ',
      todaysWeather: 'ਅੱਜ ਦਾ ਮੌਸਮ',
      recentUpdates: 'ਹਾਲ ਦੀਆਂ ਅਪਡੇਟਾਂ',
      getStarted: 'ਸ਼ੁਰੂ ਕਰੋ',
      askAI: 'AI ਸਹਾਇਕ ਤੋਂ ਪੁੱਛੋ',
      getCropAdvice: 'ਫਸਲ ਸਲਾਹ ਪ੍ਰਾਪਤ ਕਰੋ',
      detectPests: 'ਕੀੜੇ ਪਛਾਣੋ',
      checkPrices: 'ਬਾਜ਼ਾਰ ਭਾਅ ਦੇਖੋ',
      weatherLocation: 'ਨਵੀਂ ਦਿੱਲੀ, ਭਾਰਤ',
      temperature: '28°C',
      condition: 'ਅੰਸ਼ਿਕ ਬਦਲੀ',
      humidity: 'ਨਮੀ: 65%',
      rainfall: 'ਬਾਰਿਸ਼: 2mm',
      updates: [
        'ਕਣਕ ਅਤੇ ਚਾਵਲ ਦੇ ਬਾਜ਼ਾਰ ਭਾਅ ਅਪਡੇਟ ਹੋਏ',
        'ਨਵੀਂ ਕੀੜੇ ਚੇਤਾਵਨੀ: ਸਰੋਂ ਦੀ ਫਸਲ ਵਿੱਚ ਮਾਹੂ ਦਾ ਧਿਆਨ ਰੱਖੋ',
        'ਮੌਸਮ ਪੂਰਵਾਨੁਮਾਨ: ਬੀਜਾਈ ਦੇ ਮੌਸਮ ਲਈ ਚੰਗਾ ਹਫ਼ਤਾ'
      ]
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const quickActionItems = [
    { id: 'chatbot', label: t.askAI, icon: MessageCircle, variant: 'voice' as const },
    { id: 'recommendations', label: t.getCropAdvice, icon: Lightbulb, variant: 'field' as const },
    { id: 'pest-detection', label: t.detectPests, icon: Bug, variant: 'warning' as const },
    { id: 'market-prices', label: t.checkPrices, icon: TrendingUp, variant: 'success' as const },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Hero Section */}
      <div className="text-center bg-gradient-sky rounded-2xl p-6 sm:p-8 shadow-medium">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
          {t.welcome}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground mb-6">
          {t.subtitle}
        </p>
        <div className="text-5xl sm:text-6xl mb-4">🌾</div>
      </div>

      {/* Quick Actions */}
      <Card className="p-4 sm:p-6 shadow-medium">
        <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">{t.quickActions}</h2>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickActionItems.map((item) => (
            <Button
              key={item.id}
              variant={item.variant}
              size="default"
              className="h-auto py-3 sm:py-4 flex flex-col gap-1 sm:gap-2 text-center"
              onClick={() => onNavigate(item.id)}
            >
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium">{item.label}</span>
            </Button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Weather Card */}
        <Card className="p-4 sm:p-6 shadow-medium">
          <h3 className="text-lg sm:text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
            {t.todaysWeather}
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t.weatherLocation}</span>
              <Badge variant="outline" className="text-sm">{t.temperature}</Badge>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-center py-3 sm:py-4">
              ⛅ {t.condition}
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Thermometer className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                {t.humidity}
              </div>
              <div className="flex items-center gap-2">
                <CloudRain className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                {t.rainfall}
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Updates */}
        <Card className="p-4 sm:p-6 shadow-medium">
          <h3 className="text-lg sm:text-xl font-bold text-primary mb-4">
            {t.recentUpdates}
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {t.updates.map((update, index) => (
              <div key={index} className="flex items-start gap-2 sm:gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-xs sm:text-sm text-muted-foreground">{update}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Get Started Section */}
      <Card className="p-6 text-center bg-gradient-earth shadow-medium">
        <h3 className="text-xl sm:text-2xl font-bold text-primary mb-2">{t.getStarted}</h3>
        <p className="text-sm sm:text-base text-muted-foreground mb-4">
          {language === 'hi' 
            ? 'स्मार्ट खुला के साथ अपनी कृषि यात्रा शुरू करें'
            : language === 'pa'
            ? 'ਸਮਾਰਟ ਸਲਾਹ ਨਾਲ ਆਪਣੀ ਖੇਤੀ ਦੀ ਯਾਤਰਾ ਸ਼ੁਰੂ ਕਰੋ'
            : 'Start your smart farming journey with personalized advice'
          }
        </p>
        <Button
          variant="hero"
          size="default"
          onClick={() => onNavigate('chatbot')}
          className="text-sm sm:text-base"
        >
          {t.askAI} 🤖
        </Button>
      </Card>
    </div>
  );
};