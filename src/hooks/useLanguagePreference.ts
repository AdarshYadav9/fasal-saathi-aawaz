import { useState, useEffect } from 'react';

export const useLanguagePreference = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('hi');

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

  // Save language preference
  const updateLanguage = (language: string) => {
    setSelectedLanguage(language);
    localStorage.setItem('preferred-language', language);
  };

  return {
    selectedLanguage,
    updateLanguage
  };
};



