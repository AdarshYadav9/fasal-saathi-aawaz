import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Navigation } from '@/components/Navigation';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Dashboard } from '@/components/Dashboard';
import VoiceAssistant from '@/components/VoiceAssistant';
import CropRecommendation from '@/components/CropRecommendation';
import PestDetection from '@/components/PestDetection';
import WelcomeScreen from '@/components/WelcomeScreen';
import MarketPrices from '@/components/MarketPrices';
import { useLanguagePreference } from '@/hooks/useLanguagePreference';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const Index = () => {
  const location = useLocation();
  const { selectedLanguage, updateLanguage } = useLanguagePreference();
  const [currentView, setCurrentView] = useState('home');
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);

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

  const handleLanguageChange = (language: string) => {
    updateLanguage(language);
    setHasSelectedLanguage(true);
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  const handleVoiceInput = () => {
    // Implement voice input functionality
    console.log('Voice input activated');
  };

  const handleTextToSpeech = () => {
    // Implement text-to-speech functionality
    console.log('Text-to-speech activated');
  };

  // Show welcome screen with language selection first if not selected
  if (!hasSelectedLanguage) {
    return <WelcomeScreen onLanguageSelected={() => setHasSelectedLanguage(true)} />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <Dashboard 
          language={selectedLanguage} 
          onNavigate={handleViewChange} 
          onVoiceInput={handleVoiceInput}
          onTextToSpeech={handleTextToSpeech}
        />;
      case 'chatbot':
        return <VoiceAssistant 
          language={selectedLanguage} 
          onNavigate={handleViewChange} 
        />;
      case 'recommendations':
        return <CropRecommendation 
          language={selectedLanguage} 
          onBack={() => setCurrentView('home')} 
        />;
      case 'pest-detection':
        return <PestDetection 
          language={selectedLanguage} 
          onBack={() => setCurrentView('home')} 
        />;
      case 'market-prices':
        return <MarketPrices language={selectedLanguage} />;
      default:
        return <Dashboard 
          language={selectedLanguage} 
          onNavigate={handleViewChange} 
          onVoiceInput={handleVoiceInput}
          onTextToSpeech={handleTextToSpeech}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-background to-forest-50 text-base">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="w-full sm:w-auto">
            <Navigation
              currentView={currentView}
              onViewChange={handleViewChange}
              language={selectedLanguage}
            />
          </div>
        </div>
        {renderCurrentView()}

        {/* Bottom Navigation */}
        <BottomNavigation
          currentView={currentView}
          onViewChange={handleViewChange}
          language={selectedLanguage}
          onVoiceInput={handleVoiceInput}
          onTextToSpeech={handleTextToSpeech}
        />
      </div>
    </div>
  );
};

export default Index;
