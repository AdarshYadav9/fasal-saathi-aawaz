import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, RotateCcw, CheckCircle, AlertCircle, Volume2 } from 'lucide-react';

interface VoiceLoginProps {
  onSuccess: (user: any) => void;
  selectedLanguage: string;
  onBack: () => void;
}

const VoiceLogin: React.FC<VoiceLoginProps> = ({ onSuccess, selectedLanguage, onBack }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'intro' | 'listening' | 'processing' | 'success'>('intro');

  const startListening = () => {
    setIsListening(true);
    setStep('listening');
    setError('');
    setTranscript('');
    
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      setIsProcessing(true);
      setStep('processing');
      
      // Simulate processing
      setTimeout(() => {
        setIsProcessing(false);
        setTranscript(getSampleTranscript());
        setStep('success');
        
        // Auto proceed after success
        setTimeout(() => {
          onSuccess({ 
            name: getSampleName(), 
            phone: 'Voice Login',
            language: selectedLanguage,
            voiceId: 'voice_' + Date.now()
          });
        }, 2000);
      }, 3000);
    }, 5000);
  };

  const getSampleTranscript = () => {
    switch (selectedLanguage) {
      case 'hi': return 'नमस्ते, मैं किसान सिंह हूं, मेरा फोन नंबर निन्यानवे आठ सात छह पांच चार तीन दो एक शून्य है';
      case 'pa': return 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਮੈਂ ਕਿਸਾਨ ਸਿੰਘ ਹਾਂ, ਮੇਰਾ ਫੋਨ ਨੰਬਰ ਨਿੰਨਵਾਂ ਅੱਠ ਸੱਤ ਛੇ ਪੰਜ ਚਾਰ ਤਿੰਨ ਦੋ ਇੱਕ ਜ਼ੀਰੋ ਹੈ';
      default: return 'Hello, I am Kisan Singh, my phone number is nine eight seven six five four three two one zero';
    }
  };

  const getSampleName = () => {
    switch (selectedLanguage) {
      case 'hi': return 'किसान सिंह';
      case 'pa': return 'ਕਿਸਾਨ ਸਿੰਘ';
      default: return 'Kisan Singh';
    }
  };

  const getInstructionText = () => {
    switch (selectedLanguage) {
      case 'hi': return 'अपना नाम और फोन नंबर बोलें';
      case 'pa': return 'ਆਪਣਾ ਨਾਮ ਅਤੇ ਫੋਨ ਨੰਬਰ ਬੋਲੋ';
      default: return 'Say your name and phone number';
    }
  };

  const getListeningText = () => {
    switch (selectedLanguage) {
      case 'hi': return 'सुन रहे हैं...';
      case 'pa': return 'ਸੁਣ ਰਹੇ ਹਾਂ...';
      default: return 'Listening...';
    }
  };

  const getProcessingText = () => {
    switch (selectedLanguage) {
      case 'hi': return 'प्रोसेसिंग...';
      case 'pa': return 'ਪ੍ਰੋਸੈਸਿੰਗ...';
      default: return 'Processing...';
    }
  };

  const getSuccessText = () => {
    switch (selectedLanguage) {
      case 'hi': return 'सफलतापूर्वक लॉग इन!';
      case 'pa': return 'ਸਫਲਤਾਪੂਰਵਕ ਲੌਗ ਇਨ!';
      default: return 'Successfully logged in!';
    }
  };

  const getBackText = () => {
    switch (selectedLanguage) {
      case 'hi': return 'वापस जाएं';
      case 'pa': return 'ਵਾਪਸ ਜਾਓ';
      default: return 'Go Back';
    }
  };

  const getTryAgainText = () => {
    switch (selectedLanguage) {
      case 'hi': return 'फिर से कोशिश करें';
      case 'pa': return 'ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ';
      default: return 'Try Again';
    }
  };

  return (
    <div className="space-y-6">
      {/* Voice Status Card */}
      <Card className="border-0 shadow-medium bg-gradient-to-br from-voice-active/5 to-voice-listening/5">
        <CardContent className="p-6 text-center space-y-4">
          {/* Microphone Animation */}
          <div className="relative">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-all duration-500 ${
              step === 'listening' ? 'bg-voice-listening animate-voice-pulse' :
              step === 'processing' ? 'bg-voice-processing animate-pulse' :
              step === 'success' ? 'bg-success animate-crop-grow' :
              'bg-voice-active/10'
            }`}>
              {step === 'listening' && (
                <div className="absolute inset-0 rounded-full border-4 border-voice-listening animate-ping" />
              )}
              {step === 'success' ? (
                <CheckCircle className="w-12 h-12 text-success" />
              ) : (
                <Mic className={`w-12 h-12 ${
                  step === 'listening' ? 'text-voice-listening' :
                  step === 'processing' ? 'text-voice-processing' :
                  'text-voice-active'
                }`} />
              )}
            </div>
            
            {/* Voice Wave Animation */}
            {step === 'listening' && (
              <div className="flex justify-center gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-voice-listening rounded-full animate-voice-wave"
                    style={{
                      height: `${20 + i * 8}px`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Status Text */}
          <div className="space-y-2">
            <h3 className="font-poppins font-semibold text-lg">
              {step === 'intro' && getInstructionText()}
              {step === 'listening' && getListeningText()}
              {step === 'processing' && getProcessingText()}
              {step === 'success' && getSuccessText()}
            </h3>
            
            {step === 'intro' && (
              <p className="text-sm text-muted-foreground font-inter">
                {selectedLanguage === 'hi' ? 'माइक्रोफोन बटन दबाकर बोलना शुरू करें' :
                 selectedLanguage === 'pa' ? 'ਮਾਈਕ੍ਰੋਫੋਨ ਬਟਨ ਦਬਾ ਕੇ ਬੋਲਣਾ ਸ਼ੁਰੂ ਕਰੋ' :
                 'Press the microphone button to start speaking'}
              </p>
            )}

            {step === 'listening' && (
              <p className="text-sm text-voice-listening font-inter">
                {selectedLanguage === 'hi' ? 'स्पष्ट और धीमी आवाज़ में बोलें' :
                 selectedLanguage === 'pa' ? 'ਸਪਸ਼ਟ ਅਤੇ ਹੌਲੀ ਆਵਾਜ਼ ਵਿੱਚ ਬੋਲੋ' :
                 'Speak clearly and slowly'}
              </p>
            )}

            {step === 'processing' && (
              <p className="text-sm text-voice-processing font-inter">
                {selectedLanguage === 'hi' ? 'आपकी आवाज़ को समझ रहे हैं...' :
                 selectedLanguage === 'pa' ? 'ਤੁਹਾਡੀ ਆਵਾਜ਼ ਨੂੰ ਸਮਝ ਰਹੇ ਹਾਂ...' :
                 'Understanding your voice...'}
              </p>
            )}
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="mt-4 p-4 bg-white/80 rounded-lg border border-forest-100">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="w-4 h-4 text-voice-active" />
                <span className="text-sm font-inter font-medium text-foreground">
                  {selectedLanguage === 'hi' ? 'आपने कहा:' :
                   selectedLanguage === 'pa' ? 'ਤੁਸੀਂ ਕਿਹਾ:' :
                   'You said:'}
                </span>
              </div>
              <p className="text-sm font-inter text-foreground leading-relaxed">
                {transcript}
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span className="text-sm text-destructive font-inter">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        {step === 'intro' && (
          <Button 
            onClick={startListening}
            className="w-full h-14 bg-gradient-to-r from-voice-active to-voice-listening text-white font-poppins font-semibold hover:shadow-medium transition-all duration-300"
          >
            <Mic className="w-6 h-6 mr-3" />
            {selectedLanguage === 'hi' ? 'बोलना शुरू करें' :
             selectedLanguage === 'pa' ? 'ਬੋਲਣਾ ਸ਼ੁਰੂ ਕਰੋ' :
             'Start Speaking'}
          </Button>
        )}

        {step === 'success' && (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 p-3 bg-success/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="text-sm font-inter text-success font-medium">
                {selectedLanguage === 'hi' ? 'आपका खाता सफलतापूर्वक बन गया!' :
                 selectedLanguage === 'pa' ? 'ਤੁਹਾਡਾ ਖਾਤਾ ਸਫਲਤਾਪੂਰਵਕ ਬਣ ਗਿਆ!' :
                 'Your account has been created successfully!'}
              </span>
            </div>
          </div>
        )}

        {(step === 'intro' || step === 'success') && (
          <Button 
            variant="outline"
            onClick={onBack}
            className="w-full h-12 font-inter text-muted-foreground"
          >
            {getBackText()}
          </Button>
        )}

        {(step === 'listening' || step === 'processing') && (
          <Button 
            variant="outline"
            onClick={() => {
              setIsListening(false);
              setIsProcessing(false);
              setStep('intro');
              setTranscript('');
              setError('');
            }}
            className="w-full h-12 font-inter text-muted-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {getTryAgainText()}
          </Button>
        )}
      </div>

      {/* Voice Tips */}
      {step === 'intro' && (
        <Card className="border-0 shadow-soft bg-sky-50/50">
          <CardContent className="p-4">
            <h4 className="font-poppins font-semibold text-sm text-foreground mb-2">
              {selectedLanguage === 'hi' ? '💡 टिप्स:' :
               selectedLanguage === 'pa' ? '💡 ਸੁਝਾਅ:' :
               '💡 Tips:'}
            </h4>
            <ul className="text-xs text-muted-foreground font-inter space-y-1">
              <li>• {selectedLanguage === 'hi' ? 'शांत जगह पर बोलें' :
                   selectedLanguage === 'pa' ? 'ਸ਼ਾਂਤ ਜਗ੍ਹਾ \'ਤੇ ਬੋਲੋ' :
                   'Speak in a quiet place'}</li>
              <li>• {selectedLanguage === 'hi' ? 'माइक्रोफोन के पास बोलें' :
                   selectedLanguage === 'pa' ? 'ਮਾਈਕ੍ਰੋਫੋਨ ਦੇ ਨੇੜੇ ਬੋਲੋ' :
                   'Speak close to the microphone'}</li>
              <li>• {selectedLanguage === 'hi' ? 'स्पष्ट और धीमी आवाज़ में बोलें' :
                   selectedLanguage === 'pa' ? 'ਸਪਸ਼ਟ ਅਤੇ ਹੌਲੀ ਆਵਾਜ਼ ਵਿੱਚ ਬੋਲੋ' :
                   'Speak clearly and slowly'}</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VoiceLogin;



