import React from 'react';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguagePreference } from '@/hooks/useLanguagePreference';

const LanguageTest = () => {
  const { selectedLanguage, updateLanguage } = useLanguagePreference();

  const handleLanguageChange = (language: string) => {
    updateLanguage(language);
    console.log('Language selected:', language);
    alert(`Language selected: ${language}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-background to-forest-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-poppins font-bold text-forest-500 mb-2">
            Language Test Page
          </h1>
          <p className="text-muted-foreground">
            Test the language selector component
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-medium border-0">
          <LanguageSelector 
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default LanguageTest;
