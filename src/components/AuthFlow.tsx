import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mic, MicOff, Phone, Mail, Globe, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import VoiceLogin from './VoiceLogin';

interface AuthFlowProps {
  onAuthSuccess: (user: any) => void;
}

const AuthFlow: React.FC<AuthFlowProps> = ({ onAuthSuccess }) => {
  const [currentStep, setCurrentStep] = useState<'login' | 'otp' | 'voice'>('login');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('hi');

  const handlePhoneLogin = async () => {
    if (!phoneNumber) {
      setError('कृपया फोन नंबर दर्ज करें');
      return;
    }
    setIsLoading(true);
    setError('');
    
    // Simulate OTP sending
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('otp');
    }, 2000);
  };

  const handleEmailLogin = async () => {
    if (!email) {
      setError('कृपया ईमेल दर्ज करें');
      return;
    }
    setIsLoading(true);
    setError('');
    
    // Simulate OTP sending
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('otp');
    }, 2000);
  };

  const handleOtpVerification = async () => {
    if (!otp || otp.length !== 6) {
      setError('कृपया 6 अंकों का OTP दर्ज करें');
      return;
    }
    setIsLoading(true);
    setError('');
    
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      onAuthSuccess({ 
        name: 'किसान सिंह', 
        phone: phoneNumber || email,
        language: selectedLanguage 
      });
    }, 2000);
  };

  const handleVoiceLogin = () => {
    setCurrentStep('voice');
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-background to-forest-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* App Branding */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-field rounded-full flex items-center justify-center shadow-medium">
            <div className="text-3xl">🌾</div>
          </div>
          <div>
            <h1 className="text-3xl font-poppins font-bold text-forest-500">
              {getGreeting()}
            </h1>
            <h2 className="text-xl font-poppins font-semibold text-foreground mt-2">
              {getWelcomeText()}
            </h2>
            <p className="text-muted-foreground font-inter mt-1">
              {getSubText()}
            </p>
          </div>
        </div>

        {/* Language Selector */}
        <Card className="border-0 shadow-soft bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <LanguageSelector 
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </CardContent>
        </Card>

        {/* Authentication Options */}
        <Card className="border-0 shadow-medium bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-poppins text-xl text-forest-500">
              {selectedLanguage === 'hi' ? 'लॉग इन करें' : 
               selectedLanguage === 'pa' ? 'ਲੌਗ ਇਨ ਕਰੋ' : 'Login'}
            </CardTitle>
            <CardDescription className="font-inter text-muted-foreground">
              {selectedLanguage === 'hi' ? 'अपना खाता बनाएं या लॉग इन करें' :
               selectedLanguage === 'pa' ? 'ਆਪਣਾ ਖਾਤਾ ਬਣਾਓ ਜਾਂ ਲੌਗ ਇਨ ਕਰੋ' :
               'Create account or login'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <span className="text-sm text-destructive font-inter">{error}</span>
              </div>
            )}

            {currentStep === 'login' && (
              <Tabs defaultValue="phone" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                  <TabsTrigger value="phone" className="font-inter">
                    <Phone className="w-4 h-4 mr-2" />
                    {selectedLanguage === 'hi' ? 'फोन' : 
                     selectedLanguage === 'pa' ? 'ਫੋਨ' : 'Phone'}
                  </TabsTrigger>
                  <TabsTrigger value="email" className="font-inter">
                    <Mail className="w-4 h-4 mr-2" />
                    {selectedLanguage === 'hi' ? 'ईमेल' : 
                     selectedLanguage === 'pa' ? 'ਈਮੇਲ' : 'Email'}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="phone" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-inter text-sm font-medium">
                      {selectedLanguage === 'hi' ? 'मोबाइल नंबर' : 
                       selectedLanguage === 'pa' ? 'ਮੋਬਾਈਲ ਨੰਬਰ' : 'Mobile Number'}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={selectedLanguage === 'hi' ? '+91 9876543210' : 
                                   selectedLanguage === 'pa' ? '+91 9876543210' : '+91 9876543210'}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="h-12 text-lg font-inter"
                    />
                  </div>
                  <Button 
                    onClick={handlePhoneLogin}
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-field text-white font-poppins font-semibold hover:shadow-medium transition-all duration-300"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {selectedLanguage === 'hi' ? 'भेज रहे हैं...' : 
                         selectedLanguage === 'pa' ? 'ਭੇਜ ਰਹੇ ਹਾਂ...' : 'Sending...'}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {selectedLanguage === 'hi' ? 'OTP भेजें' : 
                         selectedLanguage === 'pa' ? 'OTP ਭੇਜੋ' : 'Send OTP'}
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="email" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-inter text-sm font-medium">
                      {selectedLanguage === 'hi' ? 'ईमेल पता' : 
                       selectedLanguage === 'pa' ? 'ਈਮੇਲ ਪਤਾ' : 'Email Address'}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={selectedLanguage === 'hi' ? 'kisan@example.com' : 
                                   selectedLanguage === 'pa' ? 'kisan@example.com' : 'kisan@example.com'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 text-lg font-inter"
                    />
                  </div>
                  <Button 
                    onClick={handleEmailLogin}
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-field text-white font-poppins font-semibold hover:shadow-medium transition-all duration-300"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {selectedLanguage === 'hi' ? 'भेज रहे हैं...' : 
                         selectedLanguage === 'pa' ? 'ਭੇਜ ਰਹੇ ਹਾਂ...' : 'Sending...'}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {selectedLanguage === 'hi' ? 'OTP भेजें' : 
                         selectedLanguage === 'pa' ? 'OTP ਭੇਜੋ' : 'Send OTP'}
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </TabsContent>
              </Tabs>
            )}

            {currentStep === 'otp' && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="font-poppins font-semibold text-lg">
                    {selectedLanguage === 'hi' ? 'OTP भेजा गया' : 
                     selectedLanguage === 'pa' ? 'OTP ਭੇਜਿਆ ਗਿਆ' : 'OTP Sent'}
                  </h3>
                  <p className="text-sm text-muted-foreground font-inter">
                    {selectedLanguage === 'hi' ? 'अपने फोन पर OTP दर्ज करें' : 
                     selectedLanguage === 'pa' ? 'ਆਪਣੇ ਫੋਨ \'ਤੇ OTP ਦਰਜ ਕਰੋ' : 'Enter OTP sent to your phone'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otp" className="font-inter text-sm font-medium">
                    {selectedLanguage === 'hi' ? '6 अंकों का OTP' : 
                     selectedLanguage === 'pa' ? '6 ਅੰਕਾਂ ਦਾ OTP' : '6-digit OTP'}
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="h-12 text-center text-2xl font-mono tracking-widest"
                    maxLength={6}
                  />
                </div>

                <Button 
                  onClick={handleOtpVerification}
                  disabled={isLoading || otp.length !== 6}
                  className="w-full h-12 bg-gradient-field text-white font-poppins font-semibold hover:shadow-medium transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {selectedLanguage === 'hi' ? 'जांच रहे हैं...' : 
                       selectedLanguage === 'pa' ? 'ਜਾਂਚ ਰਹੇ ਹਾਂ...' : 'Verifying...'}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {selectedLanguage === 'hi' ? 'लॉग इन करें' : 
                       selectedLanguage === 'pa' ? 'ਲੌਗ ਇਨ ਕਰੋ' : 'Login'}
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}
                </Button>

                <Button 
                  variant="ghost" 
                  onClick={() => setCurrentStep('login')}
                  className="w-full font-inter text-muted-foreground"
                >
                  {selectedLanguage === 'hi' ? 'वापस जाएं' : 
                   selectedLanguage === 'pa' ? 'ਵਾਪਸ ਜਾਓ' : 'Go Back'}
                </Button>
              </div>
            )}

            {currentStep === 'voice' && (
              <VoiceLogin 
                onSuccess={onAuthSuccess}
                selectedLanguage={selectedLanguage}
                onBack={() => setCurrentStep('login')}
              />
            )}

            {/* Voice Login Option */}
            {currentStep === 'login' && (
              <>
                <Separator className="my-4" />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground font-inter mb-3">
                    {selectedLanguage === 'hi' ? 'या आवाज़ से लॉग इन करें' : 
                     selectedLanguage === 'pa' ? 'ਜਾਂ ਆਵਾਜ਼ ਨਾਲ ਲੌਗ ਇਨ ਕਰੋ' : 'Or login with voice'}
                  </p>
                  <Button 
                    variant="outline"
                    onClick={handleVoiceLogin}
                    className="w-full h-12 border-2 border-voice-active text-voice-active hover:bg-voice-active hover:text-white font-poppins font-semibold transition-all duration-300"
                  >
                    <Mic className="w-5 h-5 mr-2" />
                    {selectedLanguage === 'hi' ? 'आवाज़ से लॉग इन' : 
                     selectedLanguage === 'pa' ? 'ਆਵਾਜ਼ ਨਾਲ ਲੌਗ ਇਨ' : 'Voice Login'}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 bg-white/60 rounded-lg border border-forest-100">
            <div className="w-8 h-8 bg-voice-active/10 rounded-full flex items-center justify-center">
              <Mic className="w-4 h-4 text-voice-active" />
            </div>
            <span className="text-xs font-inter text-foreground">
              {selectedLanguage === 'hi' ? 'आवाज़ सहायता' : 
               selectedLanguage === 'pa' ? 'ਆਵਾਜ਼ ਸਹਾਇਤਾ' : 'Voice Support'}
            </span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-white/60 rounded-lg border border-forest-100">
            <div className="w-8 h-8 bg-harvest-500/10 rounded-full flex items-center justify-center">
              <Globe className="w-4 h-4 text-harvest-500" />
            </div>
            <span className="text-xs font-inter text-foreground">
              {selectedLanguage === 'hi' ? 'बहुभाषी' : 
               selectedLanguage === 'pa' ? 'ਬਹੁਭਾਸ਼ੀ' : 'Multilingual'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthFlow;
