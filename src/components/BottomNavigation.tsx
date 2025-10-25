import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Home, 
  Lightbulb, 
  Bug, 
  TrendingUp, 
  MessageCircle,
  Mic,
  Volume2
} from 'lucide-react'

interface BottomNavigationProps {
  currentView: string
  onViewChange: (view: string) => void
  language: string
  onVoiceInput?: () => void
  onTextToSpeech?: () => void
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  currentView, 
  onViewChange, 
  language,
  onVoiceInput,
  onTextToSpeech 
}) => {
  const translations = {
    en: {
      home: 'Home',
      advice: 'Advice',
      pests: 'Pests',
      market: 'Market',
      chat: 'AI Chat',
      voice: 'Voice',
      speak: 'Speak'
    },
    hi: {
      home: 'होम',
      advice: 'सलाह',
      pests: 'कीट',
      market: 'बाजार',
      chat: 'AI चैट',
      voice: 'आवाज',
      speak: 'बोलें'
    },
    pa: {
      home: 'ਘਰ',
      advice: 'ਸਲਾਹ',
      pests: 'ਕੀੜੇ',
      market: 'ਬਾਜ਼ਾਰ',
      chat: 'AI ਚੈਟ',
      voice: 'ਆਵਾਜ਼',
      speak: 'ਬੋਲੋ'
    }
  }

  const t = translations[language as keyof typeof translations] || translations.en

  const navigationItems = [
    { 
      id: 'home', 
      label: t.home, 
      icon: Home, 
      emoji: '🏠',
      color: 'bg-gradient-to-br from-forest-500 to-forest-600 hover:from-forest-600 hover:to-forest-700'
    },
    { 
      id: 'advice', 
      label: t.advice, 
      icon: Lightbulb, 
      emoji: '🌱',
      color: 'bg-gradient-to-br from-harvest-500 to-harvest-600 hover:from-harvest-600 hover:to-harvest-700'
    },
    { 
      id: 'pests', 
      label: t.pests, 
      icon: Bug, 
      emoji: '🐛',
      color: 'bg-gradient-to-br from-warning to-orange-600 hover:from-orange-600 hover:to-orange-700'
    },
    { 
      id: 'market', 
      label: t.market, 
      icon: TrendingUp, 
      emoji: '📊',
      color: 'bg-gradient-to-br from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700'
    },
    { 
      id: 'chat', 
      label: t.chat, 
      icon: MessageCircle, 
      emoji: '🤖',
      color: 'bg-gradient-to-br from-soil-500 to-soil-600 hover:from-soil-600 hover:to-soil-700'
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-forest-100 shadow-medium z-50">
      <div className="max-w-md mx-auto">
        {/* Voice Controls */}
        <div className="flex justify-center gap-2 p-2 bg-gradient-to-r from-forest-50 to-sky-50 border-b border-forest-100">
          <Button
            variant="outline"
            size="sm"
            onClick={onVoiceInput}
            className="flex items-center gap-1 text-xs bg-gradient-to-r from-voice-active to-voice-listening hover:shadow-medium border-voice-active/30 text-white font-inter font-medium"
          >
            <Mic className="w-3 h-3" />
            {t.voice}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onTextToSpeech}
            className="flex items-center gap-1 text-xs bg-gradient-to-r from-sky-500 to-sky-600 hover:shadow-medium border-sky-500/30 text-white font-inter font-medium"
          >
            <Volume2 className="w-3 h-3" />
            {t.speak}
          </Button>
        </div>

        {/* Navigation Items */}
        <div className="grid grid-cols-5 gap-1 p-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? "default" : "ghost"}
              size="sm"
              className={`flex flex-col items-center gap-1 h-16 p-1 text-xs font-poppins font-medium transition-all duration-300 ${
                currentView === item.id 
                  ? item.color + ' text-white shadow-medium hover:shadow-strong' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
              onClick={() => onViewChange(item.id)}
            >
              <div className={`text-lg transition-transform duration-300 ${
                currentView === item.id ? 'scale-110' : 'scale-100'
              }`}>
                {item.emoji}
              </div>
              <span className="text-xs leading-tight font-inter">{item.label}</span>
              {currentView === item.id && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
