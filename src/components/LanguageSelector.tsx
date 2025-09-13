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
];

interface LanguageSelectorProps {
  onLanguageSelect: (language: Language) => void;
}

export const LanguageSelector = ({ onLanguageSelect }: LanguageSelectorProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    onLanguageSelect(language);
  };

  return (
    <div className="min-h-screen bg-gradient-sky flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center shadow-strong">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            🌾 Smart Crop Advisory
          </h1>
          <p className="text-muted-foreground">
            Choose your preferred language
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            अपनी भाषा चुनें | ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ
          </p>
        </div>

        <div className="space-y-3">
          {languages.map((language) => (
            <Button
              key={language.code}
              variant={selectedLanguage?.code === language.code ? "field" : "outline"}
              size="xl"
              className="w-full justify-start gap-4"
              onClick={() => handleLanguageSelect(language)}
            >
              <span className="text-2xl">{language.flag}</span>
              <div className="text-left">
                <div className="font-semibold">{language.nativeName}</div>
                <div className="text-sm opacity-80">{language.name}</div>
              </div>
            </Button>
          ))}
        </div>

        {selectedLanguage && (
          <div className="mt-6 p-4 bg-success/10 rounded-lg border border-success/20">
            <p className="text-success-foreground text-sm">
              ✓ Language selected: {selectedLanguage.nativeName}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};