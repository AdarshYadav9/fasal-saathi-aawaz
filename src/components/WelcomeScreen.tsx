import React from 'react';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguagePreference } from '@/hooks/useLanguagePreference';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Mic, 
  Volume2, 
  Globe, 
  Sprout, 
  Bug, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';

interface WelcomeScreenProps {
  onLanguageSelected: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLanguageSelected }) => {
  const { selectedLanguage, updateLanguage } = useLanguagePreference();

  const getGreeting = () => {
    switch (selectedLanguage) {
      case 'hi': return 'नमस्ते!';
      case 'pa': return 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ!';
      default: return 'Hello!';
    }
  };

  const getWelcomeText = () => {
    switch (selectedLanguage) {
      case 'hi': return 'फसल साथी आवाज में आपका स्वागत है';
      case 'pa': return 'ਫਸਲ ਸਾਥੀ ਆਵਾਜ਼ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ';
      default: return 'Welcome to Fasal Saathi Aawaz';
    }
  };

  const getSubText = () => {
    switch (selectedLanguage) {
      case 'hi': return 'आपकी आवाज़ से स्मार्ट खेती की सलाह';
      case 'pa': return 'ਤੁਹਾਡੀ ਆਵਾਜ਼ ਨਾਲ ਸਮਾਰਟ ਖੇਤੀ ਦੀ ਸਲਾਹ';
      default: return 'Smart farming advice through your voice';
    }
  };

  const getContinueText = () => {
    switch (selectedLanguage) {
      case 'hi': return 'जारी रखें';
      case 'pa': return 'ਜਾਰੀ ਰੱਖੋ';
      default: return 'Continue';
    }
  };

  const getFeaturesText = () => {
    switch (selectedLanguage) {
      case 'hi': return 'मुख्य विशेषताएं';
      case 'pa': return 'ਮੁੱਖ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ';
      default: return 'Key Features';
    }
  };

  const features = [
    {
      icon: Mic,
      title: selectedLanguage === 'hi' ? 'आवाज़ सहायता' : 
             selectedLanguage === 'pa' ? 'ਆਵਾਜ਼ ਸਹਾਇਤਾ' : 'Voice Support',
      description: selectedLanguage === 'hi' ? 'आवाज़ से बात करें' : 
                   selectedLanguage === 'pa' ? 'ਆਵਾਜ਼ ਨਾਲ ਗੱਲ ਕਰੋ' : 'Talk to get help'
    },
    {
      icon: Globe,
      title: selectedLanguage === 'hi' ? 'बहुभाषी' : 
             selectedLanguage === 'pa' ? 'ਬਹੁਭਾਸ਼ੀ' : 'Multilingual',
      description: selectedLanguage === 'hi' ? 'कई भाषाओं में उपलब्ध' : 
                   selectedLanguage === 'pa' ? 'ਕਈ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਉਪਲਬਧ' : 'Available in multiple languages'
    },
    {
      icon: Sprout,
      title: selectedLanguage === 'hi' ? 'फसल सलाह' : 
             selectedLanguage === 'pa' ? 'ਫਸਲ ਸਲਾਹ' : 'Crop Advice',
      description: selectedLanguage === 'hi' ? 'स्मार्ट खेती की सलाह' : 
                   selectedLanguage === 'pa' ? 'ਸਮਾਰਟ ਖੇਤੀ ਦੀ ਸਲਾਹ' : 'Smart farming advice'
    },
    {
      icon: Bug,
      title: selectedLanguage === 'hi' ? 'कीट पहचान' : 
             selectedLanguage === 'pa' ? 'ਕੀੜੇ ਪਛਾਣ' : 'Pest Detection',
      description: selectedLanguage === 'hi' ? 'कीटों की पहचान करें' : 
                   selectedLanguage === 'pa' ? 'ਕੀੜਿਆਂ ਦੀ ਪਛਾਣ ਕਰੋ' : 'Identify pests'
    },
    {
      icon: TrendingUp,
      title: selectedLanguage === 'hi' ? 'बाजार भाव' : 
             selectedLanguage === 'pa' ? 'ਬਾਜ਼ਾਰ ਭਾਅ' : 'Market Prices',
      description: selectedLanguage === 'hi' ? 'ताज़ा बाजार भाव' : 
                   selectedLanguage === 'pa' ? 'ਤਾਜ਼ੇ ਬਾਜ਼ਾਰ ਭਾਅ' : 'Latest market prices'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-background to-forest-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* App Branding */}
        <div className="text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-gradient-field rounded-full flex items-center justify-center shadow-medium">
            <div className="text-4xl">🌾</div>
          </div>
          <div>
            <h1 className="text-4xl font-poppins font-bold text-forest-500">
              {getGreeting()}
            </h1>
            <h2 className="text-2xl font-poppins font-semibold text-foreground mt-3">
              {getWelcomeText()}
            </h2>
            <p className="text-lg text-muted-foreground font-inter mt-2">
              {getSubText()}
            </p>
          </div>
        </div>

        {/* Language Selection */}
        <Card className="border-0 shadow-medium bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <LanguageSelector 
              selectedLanguage={selectedLanguage}
              onLanguageChange={updateLanguage}
            />
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="space-y-4">
          <h3 className="text-xl font-poppins font-semibold text-center text-foreground">
            {getFeaturesText()}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-soft bg-white/80 backdrop-blur-sm hover:shadow-medium transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-field/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <feature.icon className="w-6 h-6 text-forest-500" />
                  </div>
                  <h4 className="font-poppins font-semibold text-foreground mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground font-inter">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={onLanguageSelected}
            className="bg-gradient-field text-white font-poppins font-semibold px-8 py-3 text-lg hover:shadow-medium transition-all duration-300"
          >
            {getContinueText()}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
