import React from 'react';
import { LanguageSelector } from '@/components/LanguageSelector';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LanguageTest = () => {
  const handleLanguageSelect = (language: Language) => {
    console.log('Language selected:', language);
    alert(`Language selected: ${language.nativeName} (${language.name})`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <LanguageSelector onLanguageSelect={handleLanguageSelect} />
    </div>
  );
};

export default LanguageTest;
