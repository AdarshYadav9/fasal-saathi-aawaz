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
      color: 'bg-green-500 hover:bg-green-600'
    },
    { 
      id: 'advice', 
      label: t.advice, 
      icon: Lightbulb, 
      emoji: '🌱',
      color: 'bg-yellow-500 hover:bg-yellow-600'
    },
    { 
      id: 'pests', 
      label: t.pests, 
      icon: Bug, 
      emoji: '🐛',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    { 
      id: 'market', 
      label: t.market, 
      icon: TrendingUp, 
      emoji: '📊',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    { 
      id: 'chat', 
      label: t.chat, 
      icon: MessageCircle, 
      emoji: '🤖',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-md mx-auto">
        {/* Voice Controls */}
        <div className="flex justify-center gap-2 p-2 bg-gray-50 border-b">
          <Button
            variant="outline"
            size="sm"
            onClick={onVoiceInput}
            className="flex items-center gap-1 text-xs bg-green-100 hover:bg-green-200 border-green-300"
          >
            <Mic className="w-3 h-3" />
            {t.voice}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onTextToSpeech}
            className="flex items-center gap-1 text-xs bg-blue-100 hover:bg-blue-200 border-blue-300"
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
              className={`flex flex-col items-center gap-1 h-16 p-1 text-xs font-medium ${
                currentView === item.id 
                  ? item.color + ' text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
              onClick={() => onViewChange(item.id)}
            >
              <div className="text-lg">{item.emoji}</div>
              <span className="text-xs leading-tight">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
