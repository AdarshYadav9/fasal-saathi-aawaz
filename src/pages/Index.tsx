import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Navigation } from '@/components/Navigation';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Dashboard } from '@/components/Dashboard';
import { VoiceChatbot } from '@/components/VoiceChatbot';
import { CropRecommendation } from '@/components/CropRecommendation';
import { PestDetection } from '@/components/PestDetection';
import { SoilUpload } from '@/components/SoilUpload';
import MarketPrices from '@/components/MarketPrices';
import { ClerkAuthModal } from '@/components/ClerkAuthModal';
import { useClerkAuth } from '@/contexts/ClerkAuthContext';
import { Button } from '@/components/ui/button';
import { LogIn, User } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const Index = () => {
  const { user, isSignedIn, isLoaded } = useClerkAuth();
  const location = useLocation();
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [currentView, setCurrentView] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Handle routing based on URL
  useEffect(() => {
    const path = location.pathname;
    if (path === '/home' || path === '/') {
      setCurrentView('home');
    } else if (path === '/advice') {
      setCurrentView('recommendations');
    } else if (path === '/pests') {
      setCurrentView('pest-detection');
    } else if (path === '/market') {
      setCurrentView('market-prices');
    } else if (path === '/chat') {
      setCurrentView('chatbot');
    }
  }, [location.pathname]);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const handleVoiceInput = () => {
    // Implement voice input functionality
    console.log('Voice input activated');
  };

  const handleTextToSpeech = () => {
    // Implement text-to-speech functionality
    console.log('Text-to-speech activated');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!selectedLanguage) {
    return <LanguageSelector onLanguageSelect={handleLanguageSelect} />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <Dashboard 
          language={selectedLanguage.code} 
          onNavigate={handleViewChange} 
          user={user}
          onVoiceInput={handleVoiceInput}
          onTextToSpeech={handleTextToSpeech}
        />;
      case 'chatbot':
        return <VoiceChatbot language={selectedLanguage.code} />;
      case 'recommendations':
        return <CropRecommendation language={selectedLanguage.code} />;
      case 'pest-detection':
        return <PestDetection language={selectedLanguage.code} />;
      case 'market-prices':
        return <MarketPrices language={selectedLanguage.code} />;
      case 'soil-upload':
        return <SoilUpload
          language={selectedLanguage.code}
          onUpload={async (file) => {
            // Mock upload function - replace with actual API call
            console.log('Uploading file:', file);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }}
        />;
      default:
        return <Dashboard 
          language={selectedLanguage.code} 
          onNavigate={handleViewChange} 
          user={user}
          onVoiceInput={handleVoiceInput}
          onTextToSpeech={handleTextToSpeech}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-base">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="w-full sm:w-auto">
            <Navigation
              currentView={currentView}
              onViewChange={handleViewChange}
              language={selectedLanguage.code}
              isSignedIn={isSignedIn}
              onSignInClick={() => setShowAuthModal(true)}
            />
          </div>
        </div>
        {renderCurrentView()}

        <ClerkAuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          language={selectedLanguage.code}
        />

        {/* Bottom Navigation */}
        <BottomNavigation
          currentView={currentView}
          onViewChange={handleViewChange}
          language={selectedLanguage.code}
          onVoiceInput={handleVoiceInput}
          onTextToSpeech={handleTextToSpeech}
        />
      </div>
    </div>
  );
};

export default Index;
