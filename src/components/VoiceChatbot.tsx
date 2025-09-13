import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  language: string;
}

interface VoiceChatbotProps {
  language: string;
}

export const VoiceChatbot = ({ language }: VoiceChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Mock responses in different languages
  const mockResponses = {
    en: [
      "Based on your location, I recommend planting wheat in November for best results.",
      "For pest control, try neem oil spray every 15 days during the growing season.",
      "Current market price for rice is ₹2,100 per quintal in your area.",
      "Weather forecast shows good rainfall this week, perfect for sowing season.",
    ],
    hi: [
      "आपके क्षेत्र के अनुसार, नवंबर में गेहूं बोना सबसे अच्छा रहेगा।",
      "कीट नियंत्रण के लिए, बढ़ते मौसम में हर 15 दिन में नीम का तेल छिड़कें।",
      "आपके क्षेत्र में चावल का वर्तमान बाजार भाव ₹2,100 प्रति क्विंटल है।",
      "मौसम पूर्वानुमान इस सप्ताह अच्छी बारिश दिखा रहा है, बुवाई के लिए उत्तम।",
    ],
    pa: [
      "ਤੁਹਾਡੇ ਖੇਤਰ ਦੇ ਅਨੁਸਾਰ, ਨਵੰਬਰ ਵਿੱਚ ਕਣਕ ਬੀਜਣਾ ਸਭ ਤੋਂ ਵਧੀਆ ਰਹੇਗਾ।",
      "ਕੀਟ ਨਿਯੰਤਰਣ ਲਈ, ਵਧਣ ਦੇ ਮੌਸਮ ਵਿੱਚ ਹਰ 15 ਦਿਨ ਵਿੱਚ ਨਿੰਬ ਦਾ ਤੇਲ ਛਿੜਕੋ।",
      "ਤੁਹਾਡੇ ਖੇਤਰ ਵਿੱਚ ਚਾਵਲ ਦਾ ਮੌਜੂਦਾ ਬਾਜ਼ਾਰ ਭਾਅ ₹2,100 ਪ੍ਰਤੀ ਕੁਇੰਟਲ ਹੈ।",
      "ਮੌਸਮ ਪੂਰਵਾਨੁਮਾਨ ਇਸ ਹਫ਼ਤੇ ਵਧੀਆ ਬਾਰਿਸ਼ ਦਿਖਾ ਰਿਹਾ ਹੈ, ਬੀਜਾਈ ਲਈ ਬਿਲਕੁਲ ਠੀਕ।",
    ],
  };

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : 'en-US';
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        handleUserMessage(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [language]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleUserMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      language,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate mock bot response
    const responses = mockResponses[language as keyof typeof mockResponses] || mockResponses.en;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: randomResponse,
      sender: 'bot',
      timestamp: new Date(),
      language,
    };

    setMessages(prev => [...prev, botMessage]);
    setIsProcessing(false);

    // Speak the response
    speakText(randomResponse);
  };

  const speakText = (text: string) => {
    if (synthRef.current && !isSpeaking) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-primary mb-2">
          🤖 Smart Advisory Assistant
        </h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {language === 'hi' ? 'हिंदी' : language === 'pa' ? 'ਪੰਜਾਬੀ' : 'English'}
          </Badge>
          {isProcessing && (
            <Badge className="bg-voice-processing text-white animate-pulse">
              Processing...
            </Badge>
          )}
          {isSpeaking && (
            <Badge className="bg-voice-listening text-white">
              Speaking...
            </Badge>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 mb-4 overflow-y-auto max-h-96">
        {messages.length === 0 && (
          <Card className="p-6 text-center bg-muted/50">
            <div className="text-4xl mb-2">🌱</div>
            <p className="text-muted-foreground">
              {language === 'hi' 
                ? 'मुझसे फसल की सलाह के लिए पूछें! नीचे माइक बटन दबाएं।'
                : language === 'pa'
                ? 'ਮੈਨੂੰ ਫਸਲ ਦੀ ਸਲਾਹ ਲਈ ਪੁੱਛੋ! ਹੇਠਾਂ ਮਾਈਕ ਬਟਨ ਦਬਾਓ।'
                : 'Ask me for crop advice! Press the mic button below.'
              }
            </p>
          </Card>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card className={`p-4 max-w-xs lg:max-w-md ${
              message.sender === 'user' 
                ? 'bg-primary text-primary-foreground ml-4' 
                : 'bg-card mr-4'
            }`}>
              <p className="text-sm">{message.text}</p>
              <p className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </Card>
          </div>
        ))}
      </div>

      {/* Voice Controls */}
      <div className="flex items-center justify-center gap-4 p-4 bg-muted/30 rounded-lg">
        <Button
          variant={isListening ? "warning" : "voice"}
          size="icon-lg"
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
          className={isListening ? "animate-pulse" : ""}
        >
          {isListening ? <MicOff /> : <Mic />}
        </Button>

        <div className="flex flex-col items-center">
          <p className="text-sm font-medium">
            {isListening 
              ? (language === 'hi' ? 'सुन रहा हूं...' : language === 'pa' ? 'ਸੁਣ ਰਿਹਾ ਹਾਂ...' : 'Listening...')
              : (language === 'hi' ? 'बोलने के लिए दबाएं' : language === 'pa' ? 'ਬੋਲਣ ਲਈ ਦਬਾਓ' : 'Press to speak')
            }
          </p>
          {transcript && (
            <p className="text-xs text-muted-foreground mt-1">"{transcript}"</p>
          )}
        </div>

        <Button
          variant={isSpeaking ? "warning" : "secondary"}
          size="icon-lg"
          onClick={isSpeaking ? stopSpeaking : () => {}}
          disabled={!isSpeaking}
        >
          {isSpeaking ? <VolumeX /> : <Volume2 />}
        </Button>
      </div>
    </div>
  );
};