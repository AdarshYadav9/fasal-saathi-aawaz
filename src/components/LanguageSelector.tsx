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
  onLanguageSelect: (language: Language) => void;
}

export const LanguageSelector = ({ onLanguageSelect }: LanguageSelectorProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);

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

  const t = translations[selectedLanguage?.code as keyof typeof translations] || translations.en;

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    onLanguageSelect(language);
  };

  return (
    <div className="min-h-screen bg-gradient-sky flex items-center justify-center p-4">
      <Card className="w-full max-w-md md:max-w-lg p-8 text-center shadow-strong">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
            🌾 {t.smartCropAdvisory}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t.chooseLanguage}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {t.chooseLanguageNative}
          </p>
        </div>

        <div className="space-y-3">
          {languages.map((language) => (
            <Button
              key={language.code}
              variant={selectedLanguage?.code === language.code ? "field" : "outline"}
              size="lg"
              className="w-full justify-start gap-4 h-auto py-3"
              onClick={() => handleLanguageSelect(language)}
            >
              <span className="text-xl sm:text-2xl">{language.flag}</span>
              <div className="text-left">
                <div className="font-semibold text-base sm:text-lg">{language.nativeName}</div>
                <div className="text-xs sm:text-sm opacity-80">{language.name}</div>
              </div>
            </Button>
          ))}
        </div>

        {selectedLanguage && (
          <div className="mt-6 p-4 bg-success/10 rounded-lg border border-success/20">
            <p className="text-xs sm:text-sm text-success-foreground">
              {t.languageSelected} {selectedLanguage.nativeName}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};