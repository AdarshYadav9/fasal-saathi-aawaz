import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  MessageCircle, 
  Camera, 
  Lightbulb, 
  Bug, 
  TrendingUp, 
  Sun, 
  Cloud, 
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Download,
  Share2,
  HelpCircle,
  Star,
  AlertTriangle,
  Mic,
  Volume2,
  MapPin,
  Calendar,
  Clock,
  Heart,
  Award,
  Users
} from 'lucide-react'

interface DashboardProps {
  language: string
  onNavigate: (view: string) => void
  user?: any
  onVoiceInput?: () => void
  onTextToSpeech?: () => void
}

export const Dashboard = ({ language, onNavigate, user, onVoiceInput, onTextToSpeech }: DashboardProps) => {
  const translations = {
    en: {
      welcome: 'Welcome to Smart Crop Advisory',
      subtitle: 'Your AI-powered farming companion for better crop decisions',
      quickActions: 'Quick Actions',
      todaysWeather: "Today's Weather",
      weatherForecast: '3-Day Forecast',
      recentUpdates: 'Recent Updates',
      getStarted: 'Get Started',
      askAI: 'Ask AI Assistant',
      getCropAdvice: 'Get Crop Advice',
      detectPests: 'Detect Pests',
      checkPrices: 'Check Market Prices',
      uploadSoil: 'Upload Soil Photo',
      weatherLocation: 'New Delhi, India',
      temperature: '28°C',
      condition: 'Partly Cloudy',
      humidity: 'Humidity: 65%',
      rainfall: 'Rainfall: 2mm',
      windSpeed: 'Wind: 12 km/h',
      help: 'Help',
      successStories: 'Success Stories',
      voiceInput: 'Voice Input',
      textToSpeech: 'Text to Speech',
      criticalAlert: 'Critical Alert',
      weatherAlert: 'Heavy rain expected in 2 days',
      updates: [
        { type: 'price', icon: '📈', text: 'Market prices updated for wheat and rice', color: 'bg-green-100 border-green-300' },
        { type: 'pest', icon: '🐛', text: 'New pest alert: Watch for aphids in mustard crops', color: 'bg-red-100 border-red-300' },
        { type: 'crop', icon: '🌱', text: 'Crop recommendation: Perfect time for rice planting', color: 'bg-blue-100 border-blue-300' },
        { type: 'weather', icon: '🌦', text: 'Weather forecast: Good week for sowing season', color: 'bg-yellow-100 border-yellow-300' }
      ],
      testimonials: [
        { name: 'Rajesh Kumar', location: 'Punjab', story: 'Increased my wheat yield by 30% using AI advice', rating: 5 },
        { name: 'Priya Sharma', location: 'Haryana', story: 'Saved ₹50,000 on pesticides with smart detection', rating: 5 }
      ]
    },
    hi: {
      welcome: 'स्मार्ट फसल सलाहकार में स्वागत है',
      subtitle: 'बेहतर फसल निर्णयों के लिए आपका AI-संचालित कृषि साथी',
      quickActions: 'त्वरित कार्य',
      todaysWeather: 'आज का मौसम',
      weatherForecast: '3-दिन का पूर्वानुमान',
      recentUpdates: 'हाल की अपडेट',
      getStarted: 'शुरू करें',
      askAI: 'AI सहायक से पूछें',
      getCropAdvice: 'फसल सलाह प्राप्त करें',
      detectPests: 'कीट पहचानें',
      checkPrices: 'बाजार भाव देखें',
      uploadSoil: 'मिट्टी की फोटो अपलोड करें',
      weatherLocation: 'नई दिल्ली, भारत',
      temperature: '28°C',
      condition: 'आंशिक बादल',
      humidity: 'नमी: 65%',
      rainfall: 'बारिश: 2mm',
      windSpeed: 'हवा: 12 किमी/घंटा',
      help: 'सहायता',
      successStories: 'सफलता की कहानियां',
      voiceInput: 'आवाज इनपुट',
      textToSpeech: 'टेक्स्ट टू स्पीच',
      criticalAlert: 'महत्वपूर्ण चेतावनी',
      weatherAlert: '2 दिनों में भारी बारिश की संभावना',
      updates: [
        { type: 'price', icon: '📈', text: 'गेहूं और चावल के बाजार भाव अपडेट हुए', color: 'bg-green-100 border-green-300' },
        { type: 'pest', icon: '🐛', text: 'नई कीट चेतावनी: सरसों की फसल में एफिड्स पर नजर रखें', color: 'bg-red-100 border-red-300' },
        { type: 'crop', icon: '🌱', text: 'फसल सुझाव: चावल की बुवाई के लिए सही समय', color: 'bg-blue-100 border-blue-300' },
        { type: 'weather', icon: '🌦', text: 'मौसम पूर्वानुमान: बुवाई के मौसम के लिए अच्छा सप्ताह', color: 'bg-yellow-100 border-yellow-300' }
      ],
      testimonials: [
        { name: 'राजेश कुमार', location: 'पंजाब', story: 'AI सलाह से गेहूं की पैदावार 30% बढ़ाई', rating: 5 },
        { name: 'प्रिया शर्मा', location: 'हरियाणा', story: 'स्मार्ट पहचान से कीटनाशक पर ₹50,000 बचाए', rating: 5 }
      ]
    },
    pa: {
      welcome: 'ਸਮਾਰਟ ਫਸਲ ਸਲਾਹਕਾਰ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ',
      subtitle: 'ਬਿਹਤਰ ਫਸਲ ਫੈਸਲਿਆਂ ਲਈ ਤੁਹਾਡਾ AI-ਸੰਚਾਲਿਤ ਖੇਤੀ ਸਾਥੀ',
      quickActions: 'ਤੁਰੰਤ ਕਾਰਵਾਈਆਂ',
      todaysWeather: 'ਅੱਜ ਦਾ ਮੌਸਮ',
      weatherForecast: '3-ਦਿਨ ਦਾ ਪੂਰਵਾਨੁਮਾਨ',
      recentUpdates: 'ਹਾਲ ਦੀਆਂ ਅਪਡੇਟਾਂ',
      getStarted: 'ਸ਼ੁਰੂ ਕਰੋ',
      askAI: 'AI ਸਹਾਇਕ ਤੋਂ ਪੁੱਛੋ',
      getCropAdvice: 'ਫਸਲ ਸਲਾਹ ਪ੍ਰਾਪਤ ਕਰੋ',
      detectPests: 'ਕੀੜੇ ਪਛਾਣੋ',
      checkPrices: 'ਬਾਜ਼ਾਰ ਭਾਅ ਦੇਖੋ',
      uploadSoil: 'ਮਿੱਟੀ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ',
      weatherLocation: 'ਨਵੀਂ ਦਿੱਲੀ, ਭਾਰਤ',
      temperature: '28°C',
      condition: 'ਅੰਸ਼ਿਕ ਬਦਲੀ',
      humidity: 'ਨਮੀ: 65%',
      rainfall: 'ਬਾਰਿਸ਼: 2mm',
      windSpeed: 'ਹਵਾ: 12 ਕਿਮੀ/ਘੰਟਾ',
      help: 'ਸਹਾਇਤਾ',
      successStories: 'ਸਫਲਤਾ ਦੀਆਂ ਕਹਾਣੀਆਂ',
      voiceInput: 'ਆਵਾਜ਼ ਇਨਪੁੱਟ',
      textToSpeech: 'ਟੈਕਸਟ ਟੂ ਸਪੀਚ',
      criticalAlert: 'ਮਹੱਤਵਪੂਰਨ ਚੇਤਾਵਨੀ',
      weatherAlert: '2 ਦਿਨਾਂ ਵਿੱਚ ਭਾਰੀ ਬਾਰਿਸ਼ ਦੀ ਸੰਭਾਵਨਾ',
      updates: [
        { type: 'price', icon: '📈', text: 'ਕਣਕ ਅਤੇ ਚਾਵਲ ਦੇ ਬਾਜ਼ਾਰ ਭਾਅ ਅਪਡੇਟ ਹੋਏ', color: 'bg-green-100 border-green-300' },
        { type: 'pest', icon: '🐛', text: 'ਨਵੀਂ ਕੀੜੇ ਚੇਤਾਵਨੀ: ਸਰੋਂ ਦੀ ਫਸਲ ਵਿੱਚ ਮਾਹੂ ਦਾ ਧਿਆਨ ਰੱਖੋ', color: 'bg-red-100 border-red-300' },
        { type: 'crop', icon: '🌱', text: 'ਫਸਲ ਸੁਝਾਅ: ਚਾਵਲ ਦੀ ਬੀਜਾਈ ਲਈ ਸਹੀ ਸਮਾਂ', color: 'bg-blue-100 border-blue-300' },
        { type: 'weather', icon: '🌦', text: 'ਮੌਸਮ ਪੂਰਵਾਨੁਮਾਨ: ਬੀਜਾਈ ਦੇ ਮੌਸਮ ਲਈ ਚੰਗਾ ਹਫ਼ਤਾ', color: 'bg-yellow-100 border-yellow-300' }
      ],
      testimonials: [
        { name: 'ਰਾਜੇਸ਼ ਕੁਮਾਰ', location: 'ਪੰਜਾਬ', story: 'AI ਸਲਾਹ ਨਾਲ ਕਣਕ ਦੀ ਪੈਦਾਵਾਰ 30% ਵਧਾਈ', rating: 5 },
        { name: 'ਪ੍ਰਿਆ ਸ਼ਰਮਾ', location: 'ਹਰਿਆਣਾ', story: 'ਸਮਾਰਟ ਪਛਾਣ ਨਾਲ ਕੀਟਨਾਸ਼ਕ ਤੇ ₹50,000 ਬਚਾਏ', rating: 5 }
      ]
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const quickActionItems = [
    { 
      id: 'recommendations', 
      label: t.getCropAdvice, 
      icon: Lightbulb, 
      emoji: '🌱',
      color: 'bg-green-500 hover:bg-green-600 text-white',
      description: 'Get personalized crop recommendations'
    },
    { 
      id: 'soil-upload', 
      label: t.uploadSoil, 
      icon: Camera, 
      emoji: '📷',
      color: 'bg-blue-500 hover:bg-blue-600 text-white',
      description: 'Upload soil photo for analysis'
    },
    { 
      id: 'pest-detection', 
      label: t.detectPests, 
      icon: Bug, 
      emoji: '🐛',
      color: 'bg-orange-500 hover:bg-orange-600 text-white',
      description: 'Detect pests and diseases'
    },
    { 
      id: 'market-prices', 
      label: t.checkPrices, 
      icon: TrendingUp, 
      emoji: '📊',
      color: 'bg-yellow-500 hover:bg-yellow-600 text-white',
      description: 'Check current market prices'
    },
    { 
      id: 'chatbot', 
      label: t.askAI, 
      icon: MessageCircle, 
      emoji: '🤖',
      color: 'bg-purple-500 hover:bg-purple-600 text-white',
      description: 'Ask AI assistant anything'
    }
  ];

  const weatherForecast = [
    { day: 'Today', icon: '⛅', temp: '28°C', condition: 'Partly Cloudy' },
    { day: 'Tomorrow', icon: '🌧️', temp: '25°C', condition: 'Light Rain' },
    { day: 'Day After', icon: '☀️', temp: '32°C', condition: 'Sunny' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 space-y-4 sm:space-y-6 pb-20">
      {/* Hero Section with Voice Controls */}
      <div className="text-center bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg text-white">
        <div className="flex justify-between items-start mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onVoiceInput}
            className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
          >
            <Mic className="w-4 h-4 mr-2" />
            {t.voiceInput}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onTextToSpeech}
            className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            {t.textToSpeech}
          </Button>
        </div>
        
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
          {t.welcome}
        </h1>
        <p className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 opacity-90">
          {t.subtitle}
        </p>
        <div className="text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-4">🌾</div>
        
        {/* Help Button */}
        <Button
          variant="outline"
          size="sm"
          className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          {t.help} ❓
        </Button>
      </div>

      {/* Weather Alert */}
      <Alert className="border-red-300 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>{t.criticalAlert}:</strong> {t.weatherAlert}
        </AlertDescription>
      </Alert>

      {/* Quick Actions */}
      <Card className="p-3 sm:p-4 lg:p-6 shadow-lg">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary mb-3 sm:mb-4 flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          {t.quickActions}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {quickActionItems.map((item) => (
            <Button
              key={item.id}
              className={`${item.color} h-auto py-4 sm:py-6 flex flex-col gap-2 text-center min-h-[120px] shadow-md hover:shadow-lg transition-all duration-200`}
              onClick={() => onNavigate(item.id)}
            >
              <div className="text-3xl sm:text-4xl">{item.emoji}</div>
              <span className="text-sm sm:text-base font-bold leading-tight">{item.label}</span>
              <span className="text-xs opacity-90">{item.description}</span>
            </Button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        {/* Weather Card */}
        <Card className="p-3 sm:p-4 lg:p-6 shadow-lg">
          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-3 sm:mb-4 flex items-center gap-2">
            <Sun className="w-5 h-5 text-yellow-500" />
            {t.todaysWeather}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t.weatherLocation}</span>
              </div>
              <Badge variant="outline" className="text-sm bg-blue-100 text-blue-800">
                {t.temperature}
              </Badge>
            </div>
            
            <div className="text-center py-4">
              <div className="text-4xl mb-2">⛅</div>
              <div className="text-xl font-bold">{t.condition}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm">
              <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                <Thermometer className="w-4 h-4 text-muted-foreground mb-1" />
                <span className="font-medium">{t.humidity}</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                <CloudRain className="w-4 h-4 text-muted-foreground mb-1" />
                <span className="font-medium">{t.rainfall}</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                <Wind className="w-4 h-4 text-muted-foreground mb-1" />
                <span className="font-medium">{t.windSpeed}</span>
              </div>
            </div>

            {/* 3-Day Forecast */}
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">{t.weatherForecast}</h4>
              <div className="grid grid-cols-3 gap-2">
                {weatherForecast.map((day, index) => (
                  <div key={index} className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium">{day.day}</div>
                    <div className="text-lg">{day.icon}</div>
                    <div className="text-xs text-muted-foreground">{day.temp}</div>
                    <div className="text-xs">{day.condition}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Updates */}
        <Card className="p-3 sm:p-4 lg:p-6 shadow-lg">
          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-3 sm:mb-4 flex items-center gap-2">
            <span className="text-2xl">📢</span>
            {t.recentUpdates}
          </h3>
          <div className="space-y-3">
            {t.updates.map((update, index) => (
              <div key={index} className={`flex items-start gap-3 p-3 rounded-lg border ${update.color}`}>
                <div className="text-2xl">{update.icon}</div>
                <p className="text-sm text-gray-700 leading-relaxed">{update.text}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Success Stories Banner */}
      <Card className="p-4 sm:p-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white shadow-lg">
        <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          {t.successStories}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {t.testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                  ))}
                </div>
                <span className="text-sm font-semibold">{testimonial.name}</span>
              </div>
              <p className="text-sm opacity-90 mb-1">{testimonial.story}</p>
              <p className="text-xs opacity-75">📍 {testimonial.location}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Get Started Section */}
      <Card className="p-4 sm:p-6 text-center bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">{t.getStarted}</h3>
        <p className="text-sm sm:text-base text-white/90 mb-4">
          {language === 'hi' 
            ? 'स्मार्ट सलाह के साथ अपनी कृषि यात्रा शुरू करें'
            : language === 'pa'
            ? 'ਸਮਾਰਟ ਸਲਾਹ ਨਾਲ ਆਪਣੀ ਖੇਤੀ ਦੀ ਯਾਤਰਾ ਸ਼ੁਰੂ ਕਰੋ'
            : 'Start your smart farming journey with personalized advice'
          }
        </p>
        <Button
          className="bg-white text-green-600 hover:bg-gray-100 font-bold px-6 py-3 text-base"
          onClick={() => onNavigate('chatbot')}
        >
          {t.askAI} 🤖
        </Button>
      </Card>
    </div>
  );
};