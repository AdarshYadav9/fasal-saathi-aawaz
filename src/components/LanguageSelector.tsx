import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

export const LanguageSelector = ({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) => {

  const translations = {
    en: {
      smartCropAdvisory: 'Smart Crop Advisory',
      chooseLanguage: 'Choose your preferred language',
      chooseLanguageNative: 'अपनी भाषा चुनें | ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ | તમારી ભાષા પસંદ કરો',
      languageSelected: '✓ Language selected:',
    },
    hi: {
      smartCropAdvisory: 'स्मार्ट फसल सलाहकार',
      chooseLanguage: 'अपनी पसंदीदा भाषा चुनें',
      chooseLanguageNative: 'अपनी भाषा चुनें | ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ | તમારી ભાષા પસંદ કરો',
      languageSelected: '✓ भाषा चयनित:',
    },
    pa: {
      smartCropAdvisory: 'ਸਮਾਰਟ ਫਸਲ ਸਲਾਹਕਾਰ',
      chooseLanguage: 'ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ',
      chooseLanguageNative: 'अपनी भाषा चुनें | ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ | आपकी भाषा निवडा | आपकी भाषा निवडा',
      languageSelected: '✓ ਭਾਸ਼ਾ ਚੁਣੀ ਗਈ:',
    },
    gu: {
      smartCropAdvisory: 'સ્માર્ટ ક્રોપ એડવાઇઝરી',
      chooseLanguage: 'તમારી પસંદીદા ભાષા પસંદ કરો',
      chooseLanguageNative: 'अपनी भाषा चुनें | ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ | आपली भाषा निवडा | உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
      languageSelected: '✓ ભાષા પસંદ કરેલ:',
    },
    mr: {
      smartCropAdvisory: 'स्मार्ट क्रॉप एडव्हायझरी',
      chooseLanguage: 'तुमची पसंतीची भाषा निवडा',
      chooseLanguageNative: 'अपनी भाषा चुनें | ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ | आपली भाषा निवडा | உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
      languageSelected: '✓ भाषा निवडली:',
    },
    ta: {
      smartCropAdvisory: 'ஸ்மார்ட் பயிர் ஆலோசனை',
      chooseLanguage: 'உங்களுக்கு விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்',
      chooseLanguageNative: 'अपनी भाषा चुनें | ਆਪਣੀ ਭਾਸ਼ા ਚੁਣੋ | आपकी भाषा निवडा | உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
      languageSelected: '✓ மொழி தேர்ந்தெடுக்கப்பட்டது:',
    },
  };

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage) || languages[0];
  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

  const handleLanguageSelect = (language: Language) => {
    onLanguageChange(language.code);
  };

  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="font-poppins font-semibold text-sm text-foreground mb-1">
          {selectedLanguage === 'hi' ? 'भाषा चुनें' :
           selectedLanguage === 'pa' ? 'ਭਾਸ਼ਾ ਚੁਣੋ' :
           'Choose Language'}
        </h3>
        <p className="text-xs text-muted-foreground font-inter">
          {selectedLanguage === 'hi' ? 'अपनी पसंदीदा भाषा' :
           selectedLanguage === 'pa' ? 'ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ' :
           'Your preferred language'}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {languages.map((language) => (
          <Button
            key={language.code}
            variant={selectedLanguage === language.code ? "default" : "outline"}
            size="sm"
            className={`h-auto py-3 px-2 flex flex-col items-center gap-1 transition-all duration-300 ${
              selectedLanguage === language.code 
                ? 'bg-gradient-field text-white shadow-medium' 
                : 'hover:bg-muted/50'
            }`}
            onClick={() => handleLanguageSelect(language)}
          >
            <span className="text-lg">{language.flag}</span>
            <div className="text-center">
              <div className="font-inter font-medium text-xs">{language.nativeName}</div>
              <div className="text-xs opacity-70">{language.name}</div>
            </div>
          </Button>
        ))}
      </div>

      {currentLanguage && (
        <div className="flex items-center justify-center gap-2 p-2 bg-success/10 rounded-lg border border-success/20">
          <span className="text-xs font-inter text-success font-medium">
            {selectedLanguage === 'hi' ? 'चयनित:' :
             selectedLanguage === 'pa' ? 'ਚੁਣਿਆ:' :
             'Selected:'} {currentLanguage.nativeName}
          </span>
        </div>
      )}
    </div>
  );
};