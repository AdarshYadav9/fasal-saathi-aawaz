import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  Bot, 
  User, 
  RotateCcw,
  Settings,
  MessageCircle,
  Zap,
  Lightbulb,
  Bug,
  TrendingUp,
  Camera,
  Globe,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isVoice?: boolean;
  language?: string;
}

interface VoiceAssistantProps {
  language: string;
  onNavigate: (view: string) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ language, onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage = getWelcomeMessage();
    setMessages([{
      id: '1',
      text: welcomeMessage,
      sender: 'ai',
      timestamp: new Date(),
      language
    }]);
  }, [language]);

  const getWelcomeMessage = () => {
    switch (language) {
      case 'hi':
        return 'नमस्ते! मैं आपका AI कृषि सहायक हूं। आप मुझसे फसल सलाह, कीट पहचान, मौसम जानकारी या कुछ भी पूछ सकते हैं।';
      case 'pa':
        return 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ AI ਖੇਤੀ ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਮੈਨੂੰ ਫਸਲ ਸਲਾਹ, ਕੀੜੇ ਪਛਾਣ, ਮੌਸਮ ਜਾਣਕਾਰੀ ਜਾਂ ਕੁਝ ਵੀ ਪੁੱਛ ਸਕਦੇ ਹੋ।';
      default:
        return 'Hello! I am your AI farming assistant. You can ask me about crop advice, pest detection, weather information, or anything else.';
    }
  };

  const quickActions = [
    {
      id: 'weather',
      icon: '🌤️',
      label: language === 'hi' ? 'मौसम जानकारी' : 
             language === 'pa' ? 'ਮੌਸਮ ਜਾਣਕਾਰੀ' : 'Weather Info',
      action: () => sendMessage(language === 'hi' ? 'आज का मौसम कैसा है?' : 
                                language === 'pa' ? 'ਅੱਜ ਦਾ ਮੌਸਮ ਕਿਵੇਂ ਹੈ?' : 
                                'How is the weather today?')
    },
    {
      id: 'crop',
      icon: '🌱',
      label: language === 'hi' ? 'फसल सलाह' : 
             language === 'pa' ? 'ਫਸਲ ਸਲਾਹ' : 'Crop Advice',
      action: () => sendMessage(language === 'hi' ? 'इस मौसम में कौन सी फसल बोनी चाहिए?' : 
                                language === 'pa' ? 'ਇਸ ਮੌਸਮ ਵਿੱਚ ਕਿਹੜੀ ਫਸਲ ਬੀਜਣੀ ਚਾਹੀਦੀ ਹੈ?' : 
                                'Which crop should be planted this season?')
    },
    {
      id: 'pest',
      icon: '🐛',
      label: language === 'hi' ? 'कीट पहचान' : 
             language === 'pa' ? 'ਕੀੜੇ ਪਛਾਣ' : 'Pest Detection',
      action: () => sendMessage(language === 'hi' ? 'मेरी फसल में कीट दिख रहे हैं' : 
                                language === 'pa' ? 'ਮੇਰੀ ਫਸਲ ਵਿੱਚ ਕੀੜੇ ਦਿਖ ਰਹੇ ਹਨ' : 
                                'I see pests in my crop')
    },
    {
      id: 'price',
      icon: '📊',
      label: language === 'hi' ? 'बाजार भाव' : 
             language === 'pa' ? 'ਬਾਜ਼ਾਰ ਭਾਅ' : 'Market Prices',
      action: () => sendMessage(language === 'hi' ? 'आज के बाजार भाव क्या हैं?' : 
                                language === 'pa' ? 'ਅੱਜ ਦੇ ਬਾਜ਼ਾਰ ਭਾਅ ਕੀ ਹਨ?' : 
                                'What are today\'s market prices?')
    }
  ];

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      language
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        language
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
    }, 2000);
  };

  const generateAIResponse = (userText: string): string => {
    const lowerText = userText.toLowerCase();
    
    if (lowerText.includes('मौसम') || lowerText.includes('weather') || lowerText.includes('ਮੌਸਮ')) {
      return language === 'hi' ? 
        'आज का मौसम अच्छा है। तापमान 28°C है और आंशिक बादल हैं। अगले 2-3 दिनों में हल्की बारिश की संभावना है। यह फसलों के लिए अच्छा समय है।' :
        language === 'pa' ?
        'ਅੱਜ ਦਾ ਮੌਸਮ ਚੰਗਾ ਹੈ। ਤਾਪਮਾਨ 28°C ਹੈ ਅਤੇ ਅੰਸ਼ਿਕ ਬਦਲੀ ਹੈ। ਅਗਲੇ 2-3 ਦਿਨਾਂ ਵਿੱਚ ਹਲਕੀ ਬਾਰਿਸ਼ ਦੀ ਸੰਭਾਵਨਾ ਹੈ। ਇਹ ਫਸਲਾਂ ਲਈ ਚੰਗਾ ਸਮਾਂ ਹੈ।' :
        'Today\'s weather is good. Temperature is 28°C with partly cloudy skies. There\'s a chance of light rain in the next 2-3 days. This is a good time for crops.';
    }
    
    if (lowerText.includes('फसल') || lowerText.includes('crop') || lowerText.includes('ਫਸਲ')) {
      return language === 'hi' ?
        'इस मौसम में आप गेहूं, सरसों, या चना बो सकते हैं। मिट्टी की जांच करके सही फसल चुनें। मैं आपको विस्तृत सलाह दे सकता हूं।' :
        language === 'pa' ?
        'ਇਸ ਮੌਸਮ ਵਿੱਚ ਤੁਸੀਂ ਕਣਕ, ਸਰੋਂ, ਜਾਂ ਚਨਾ ਬੀਜ ਸਕਦੇ ਹੋ। ਮਿੱਟੀ ਦੀ ਜਾਂਚ ਕਰਕੇ ਸਹੀ ਫਸਲ ਚੁਣੋ। ਮੈਂ ਤੁਹਾਨੂੰ ਵਿਸਤ੍ਰਿਤ ਸਲਾਹ ਦੇ ਸਕਦਾ ਹਾਂ।' :
        'This season you can plant wheat, mustard, or chickpeas. Check your soil and choose the right crop. I can give you detailed advice.';
    }
    
    if (lowerText.includes('कीट') || lowerText.includes('pest') || lowerText.includes('ਕੀੜੇ')) {
      return language === 'hi' ?
        'कीटों की पहचान के लिए फोटो अपलोड करें। मैं आपको सही उपचार बताऊंगा। जैविक कीटनाशक का उपयोग करने की सलाह दूंगा।' :
        language === 'pa' ?
        'ਕੀੜਿਆਂ ਦੀ ਪਛਾਣ ਲਈ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ। ਮੈਂ ਤੁਹਾਨੂੰ ਸਹੀ ਇਲਾਜ ਦੱਸਾਂਗਾ। ਜੈਵਿਕ ਕੀਟਨਾਸ਼ਕ ਦੀ ਵਰਤੋਂ ਕਰਨ ਦੀ ਸਲਾਹ ਦੇਵਾਂਗਾ।' :
        'Upload a photo for pest identification. I\'ll tell you the right treatment. I recommend using organic pesticides.';
    }
    
    if (lowerText.includes('भाव') || lowerText.includes('price') || lowerText.includes('ਭਾਅ')) {
      return language === 'hi' ?
        'आज के बाजार भाव: गेहूं ₹2,100/क्विंटल, चावल ₹3,200/क्विंटल, सरसों ₹5,500/क्विंटल। कीमतें स्थिर हैं।' :
        language === 'pa' ?
        'ਅੱਜ ਦੇ ਬਾਜ਼ਾਰ ਭਾਅ: ਕਣਕ ₹2,100/ਕੁਇੰਟਲ, ਚਾਵਲ ₹3,200/ਕੁਇੰਟਲ, ਸਰੋਂ ₹5,500/ਕੁਇੰਟਲ। ਕੀਮਤਾਂ ਸਥਿਰ ਹਨ।' :
        'Today\'s market prices: Wheat ₹2,100/quintal, Rice ₹3,200/quintal, Mustard ₹5,500/quintal. Prices are stable.';
    }
    
    // Default response
    return language === 'hi' ?
      'मैं आपकी मदद करने के लिए यहां हूं। आप मुझसे कृषि से संबंधित कोई भी सवाल पूछ सकते हैं।' :
      language === 'pa' ?
      'ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਕਰਨ ਲਈ ਇੱਥੇ ਹਾਂ। ਤੁਸੀਂ ਮੈਨੂੰ ਖੇਤੀ ਨਾਲ ਸੰਬੰਧਿਤ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛ ਸਕਦੇ ਹੋ।' :
      'I\'m here to help you. You can ask me any question related to farming.';
  };

  const startListening = () => {
    setIsListening(true);
    setIsProcessing(false);
    
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      setIsProcessing(true);
      
      // Simulate processing and response
      setTimeout(() => {
        const sampleText = language === 'hi' ? 
          'मेरी फसल में कुछ कीट दिख रहे हैं' :
          language === 'pa' ?
          'ਮੇਰੀ ਫਸਲ ਵਿੱਚ ਕੁਝ ਕੀੜੇ ਦਿਖ ਰਹੇ ਹਨ' :
          'I see some pests in my crop';
        
        sendMessage(sampleText);
      }, 3000);
    }, 5000);
  };

  const stopListening = () => {
    setIsListening(false);
    setIsProcessing(false);
  };

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-sky-50 via-background to-forest-50">
      {/* Header */}
      <div className="bg-gradient-field text-white p-4 shadow-medium">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-poppins font-bold">
                {language === 'hi' ? 'AI कृषि सहायक' :
                 language === 'pa' ? 'AI ਖੇਤੀ ਸਹਾਇਕ' :
                 'AI Farming Assistant'}
              </h1>
              <p className="text-sm opacity-90 font-inter">
                {language === 'hi' ? 'आवाज़ से बात करें' :
                 language === 'pa' ? 'ਆਵਾਜ਼ ਨਾਲ ਗੱਲ ਕਰੋ' :
                 'Talk with voice'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
            onClick={() => setShowQuickActions(!showQuickActions)}
          >
            {showQuickActions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      {showQuickActions && (
        <div className="p-4 bg-white/80 backdrop-blur-sm border-b border-forest-100">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={action.action}
                className="h-auto py-3 flex flex-col gap-1 text-xs font-inter hover:bg-forest-50 hover:border-forest-200"
              >
                <span className="text-lg">{action.icon}</span>
                <span>{action.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-br from-forest-500 to-forest-600 text-white'
                    : 'bg-white border border-forest-100 shadow-soft'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-white/20' 
                      : 'bg-gradient-to-br from-sky-500 to-sky-600 text-white'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm leading-relaxed font-inter ${
                      message.sender === 'user' ? 'text-white' : 'text-foreground'
                    }`}>
                      {message.text}
                    </p>
                    <div className={`flex items-center gap-2 mt-2 text-xs ${
                      message.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'
                    }`}>
                      <span>{message.timestamp.toLocaleTimeString()}</span>
                      {message.isVoice && (
                        <Badge variant="outline" className="text-xs">
                          <Mic className="w-3 h-3 mr-1" />
                          Voice
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-white border border-forest-100 rounded-2xl p-4 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-forest-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-forest-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-forest-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Voice Controls */}
      <div className="p-4 bg-white/90 backdrop-blur-sm border-t border-forest-100">
        <div className="max-w-4xl mx-auto">
          {/* Voice Button */}
          <div className="flex justify-center mb-4">
            <Button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`w-20 h-20 rounded-full shadow-medium transition-all duration-300 ${
                isListening 
                  ? 'bg-gradient-to-br from-voice-listening to-voice-active animate-voice-pulse' 
                  : 'bg-gradient-to-br from-voice-active to-voice-listening hover:shadow-strong'
              }`}
            >
              {isListening ? (
                <MicOff className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </Button>
          </div>

          {/* Voice Status */}
          <div className="text-center mb-4">
            {isListening && (
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-voice-listening rounded-full animate-voice-wave"
                    style={{
                      height: `${20 + i * 8}px`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            )}
            <p className="text-sm text-muted-foreground font-inter">
              {isListening ? (
                language === 'hi' ? 'सुन रहे हैं...' :
                language === 'pa' ? 'ਸੁਣ ਰਹੇ ਹਾਂ...' :
                'Listening...'
              ) : (
                language === 'hi' ? 'बोलने के लिए माइक्रोफोन दबाएं' :
                language === 'pa' ? 'ਬੋਲਣ ਲਈ ਮਾਈਕ੍ਰੋਫੋਨ ਦਬਾਓ' :
                'Press microphone to speak'
              )}
            </p>
          </div>

          {/* Text Input */}
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={language === 'hi' ? 'संदेश टाइप करें...' :
                           language === 'pa' ? 'ਸੁਨੇਹਾ ਟਾਈਪ ਕਰੋ...' :
                           'Type a message...'}
              className="flex-1 font-inter"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
            />
            <Button
              onClick={() => sendMessage(inputText)}
              disabled={!inputText.trim() || isProcessing}
              className="bg-gradient-field text-white hover:shadow-medium"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Additional Controls */}
          <div className="flex justify-center gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSpeaking}
              className="text-xs font-inter"
            >
              {isSpeaking ? <VolumeX className="w-3 h-3 mr-1" /> : <Volume2 className="w-3 h-3 mr-1" />}
              {isSpeaking ? 
                (language === 'hi' ? 'आवाज़ बंद' : language === 'pa' ? 'ਆਵਾਜ਼ ਬੰਦ' : 'Mute') :
                (language === 'hi' ? 'आवाज़ चालू' : language === 'pa' ? 'ਆਵਾਜ਼ ਚਾਲੂ' : 'Unmute')
              }
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMessages([])}
              className="text-xs font-inter"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              {language === 'hi' ? 'रिसेट' : language === 'pa' ? 'ਰੀਸੈਟ' : 'Reset'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;



