// Update this page (the content is just a fallback if you fail to update the page)

import { useState } from 'react';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { VoiceChatbot } from '@/components/VoiceChatbot';
import { CropRecommendation } from '@/components/CropRecommendation';
import { PestDetection } from '@/components/PestDetection';
import { MarketPrices } from '@/components/MarketPrices';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [currentView, setCurrentView] = useState('home');

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  if (!selectedLanguage) {
    return <LanguageSelector onLanguageSelect={handleLanguageSelect} />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <Dashboard language={selectedLanguage.code} onNavigate={handleViewChange} />;
      case 'chatbot':
        return <VoiceChatbot language={selectedLanguage.code} />;
      case 'recommendations':
        return <CropRecommendation language={selectedLanguage.code} />;
      case 'pest-detection':
        return <PestDetection language={selectedLanguage.code} />;
      case 'market-prices':
        return <MarketPrices language={selectedLanguage.code} />;
      default:
        return <Dashboard language={selectedLanguage.code} onNavigate={handleViewChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <Navigation 
          currentView={currentView} 
          onViewChange={handleViewChange}
          language={selectedLanguage.code}
        />
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default Index;
