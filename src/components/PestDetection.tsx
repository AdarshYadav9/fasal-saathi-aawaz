import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Camera, 
  Upload, 
  Image as ImageIcon,
  Bug,
  AlertTriangle,
  CheckCircle,
  Info,
  Droplets,
  Shield,
  Clock,
  Zap,
  RotateCcw,
  Download,
  Share2,
  Eye,
  Crop,
  Target,
  Activity,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Heart
} from 'lucide-react';

interface PestDetectionProps {
  language: string;
  onBack: () => void;
}

interface PestResult {
  id: string;
  name: string;
  nameNative: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  symptoms: string[];
  treatment: {
    organic: string[];
    chemical: string[];
    preventive: string[];
  };
  image: string;
  affectedArea: number;
}

const PestDetection: React.FC<PestDetectionProps> = ({ language, onBack }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<PestResult[]>([]);
  const [currentStep, setCurrentStep] = useState<'upload' | 'processing' | 'results'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const samplePests: PestResult[] = [
    {
      id: 'aphid',
      name: 'Aphid',
      nameNative: language === 'hi' ? 'एफिड' : language === 'pa' ? 'ਮਾਹੂ' : 'Aphid',
      confidence: 92,
      severity: 'medium',
      description: language === 'hi' ? 'छोटे हरे या काले कीट जो पौधों का रस चूसते हैं' : 
                   language === 'pa' ? 'ਛੋਟੇ ਹਰੇ ਜਾਂ ਕਾਲੇ ਕੀੜੇ ਜੋ ਪੌਦਿਆਂ ਦਾ ਰਸ ਚੂਸਦੇ ਹਨ' : 
                   'Small green or black insects that suck plant sap',
      symptoms: [
        language === 'hi' ? 'पत्तियों का पीला पड़ना' : language === 'pa' ? 'ਪੱਤਿਆਂ ਦਾ ਪੀਲਾ ਪੈਣਾ' : 'Yellowing of leaves',
        language === 'hi' ? 'पत्तियों का मुड़ना' : language === 'pa' ? 'ਪੱਤਿਆਂ ਦਾ ਮੁੜਨਾ' : 'Curling of leaves',
        language === 'hi' ? 'पौधे की वृद्धि रुकना' : language === 'pa' ? 'ਪੌਦੇ ਦੀ ਵਾਧਾ ਰੁਕਣਾ' : 'Stunted plant growth'
      ],
      treatment: {
        organic: [
          language === 'hi' ? 'नीम का तेल (2ml प्रति लीटर पानी)' : language === 'pa' ? 'ਨੀਮ ਦਾ ਤੇਲ (2ml ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ)' : 'Neem oil (2ml per liter water)',
          language === 'hi' ? 'साबुन का घोल (5ml प्रति लीटर)' : language === 'pa' ? 'ਸਾਬਣ ਦਾ ਘੋਲ (5ml ਪ੍ਰਤੀ ਲੀਟਰ)' : 'Soap solution (5ml per liter)',
          language === 'hi' ? 'लहसुन का स्प्रे' : language === 'pa' ? 'ਲਸਣ ਦਾ ਸਪਰੇ' : 'Garlic spray'
        ],
        chemical: [
          language === 'hi' ? 'इमिडाक्लोप्रिड (0.5ml प्रति लीटर)' : language === 'pa' ? 'ਇਮਿਡਾਕਲੋਪ੍ਰਿਡ (0.5ml ਪ੍ਰਤੀ ਲੀਟਰ)' : 'Imidacloprid (0.5ml per liter)',
          language === 'hi' ? 'एसिटामिप्रिड (1ml प्रति लीटर)' : language === 'pa' ? 'ਐਸੀਟਾਮਿਪ੍ਰਿਡ (1ml ਪ੍ਰਤੀ ਲੀਟਰ)' : 'Acetamiprid (1ml per liter)'
        ],
        preventive: [
          language === 'hi' ? 'नियमित निरीक्षण' : language === 'pa' ? 'ਨਿਯਮਿਤ ਨਿਰੀਖਣ' : 'Regular inspection',
          language === 'hi' ? 'प्राकृतिक शत्रु (लैडीबग) को बढ़ावा दें' : language === 'pa' ? 'ਕੁਦਰਤੀ ਦੁਸ਼ਮਣ (ਲੇਡੀਬੱਗ) ਨੂੰ ਵਧਾਓ' : 'Promote natural enemies (ladybugs)',
          language === 'hi' ? 'पौधों के बीच उचित दूरी रखें' : language === 'pa' ? 'ਪੌਦਿਆਂ ਵਿਚਕਾਰ ਉਚਿਤ ਦੂਰੀ ਰੱਖੋ' : 'Maintain proper spacing between plants'
        ]
      },
      image: '🦗',
      affectedArea: 15
    },
    {
      id: 'whitefly',
      name: 'Whitefly',
      nameNative: language === 'hi' ? 'सफेद मक्खी' : language === 'pa' ? 'ਚਿੱਟੀ ਮੱਖੀ' : 'Whitefly',
      confidence: 87,
      severity: 'high',
      description: language === 'hi' ? 'छोटे सफेद कीट जो पत्तियों के नीचे रहते हैं' : 
                   language === 'pa' ? 'ਛੋਟੇ ਚਿੱਟੇ ਕੀੜੇ ਜੋ ਪੱਤਿਆਂ ਦੇ ਹੇਠਾਂ ਰਹਿੰਦੇ ਹਨ' : 
                   'Small white insects that live under leaves',
      symptoms: [
        language === 'hi' ? 'पत्तियों पर सफेद धब्बे' : language === 'pa' ? 'ਪੱਤਿਆਂ \'ਤੇ ਚਿੱਟੇ ਧੱਬੇ' : 'White spots on leaves',
        language === 'hi' ? 'हनीड्यू का निर्माण' : language === 'pa' ? 'ਹਨੀਡਿਊ ਦਾ ਨਿਰਮਾਣ' : 'Honeydew formation',
        language === 'hi' ? 'काली फफूंदी' : language === 'pa' ? 'ਕਾਲੀ ਫੰਗਸ' : 'Black mold'
      ],
      treatment: {
        organic: [
          language === 'hi' ? 'पीली स्टिकी ट्रैप' : language === 'pa' ? 'ਪੀਲੀ ਸਟਿੱਕੀ ਟ੍ਰੈਪ' : 'Yellow sticky traps',
          language === 'hi' ? 'नीम का तेल स्प्रे' : language === 'pa' ? 'ਨੀਮ ਦਾ ਤੇਲ ਸਪਰੇ' : 'Neem oil spray',
          language === 'hi' ? 'साबुन और तेल का मिश्रण' : language === 'pa' ? 'ਸਾਬਣ ਅਤੇ ਤੇਲ ਦਾ ਮਿਸ਼ਰਣ' : 'Soap and oil mixture'
        ],
        chemical: [
          language === 'hi' ? 'बुफोप्रोफेजिन (1ml प्रति लीटर)' : language === 'pa' ? 'ਬੁਫੋਪ੍ਰੋਫੇਜਿਨ (1ml ਪ੍ਰਤੀ ਲੀਟਰ)' : 'Buprofezin (1ml per liter)',
          language === 'hi' ? 'थायामेथोक्साम (0.5ml प्रति लीटर)' : language === 'pa' ? 'ਥਾਇਆਮੇਥੋਕਸਾਮ (0.5ml ਪ੍ਰਤੀ ਲੀਟਰ)' : 'Thiamethoxam (0.5ml per liter)'
        ],
        preventive: [
          language === 'hi' ? 'पौधों को हवादार रखें' : language === 'pa' ? 'ਪੌਦਿਆਂ ਨੂੰ ਹਵਾਦਾਰ ਰੱਖੋ' : 'Keep plants well-ventilated',
          language === 'hi' ? 'अधिक पानी से बचें' : language === 'pa' ? 'ਵਧੇਰੇ ਪਾਣੀ ਤੋਂ ਬਚੋ' : 'Avoid overwatering',
          language === 'hi' ? 'संक्रमित पौधों को अलग करें' : language === 'pa' ? 'ਸੰਕਰਮਿਤ ਪੌਦਿਆਂ ਨੂੰ ਅਲੱਗ ਕਰੋ' : 'Isolate infected plants'
        ]
      },
      image: '🦟',
      affectedArea: 25
    }
  ];

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setCurrentStep('processing');
      setIsProcessing(true);
      
      // Simulate processing
      setTimeout(() => {
        setIsProcessing(false);
        setResults(samplePests);
        setCurrentStep('results');
      }, 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleImageUpload(files[0]);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'low': return language === 'hi' ? 'कम' : language === 'pa' ? 'ਕਮ' : 'Low';
      case 'medium': return language === 'hi' ? 'मध्यम' : language === 'pa' ? 'ਮੱਧਮ' : 'Medium';
      case 'high': return language === 'hi' ? 'उच्च' : language === 'pa' ? 'ਉੱਚ' : 'High';
      case 'critical': return language === 'hi' ? 'गंभीर' : language === 'pa' ? 'ਗੰਭੀਰ' : 'Critical';
      default: return severity;
    }
  };

  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-poppins font-bold text-forest-500 mb-2">
          {language === 'hi' ? 'कीट की फोटो अपलोड करें' :
           language === 'pa' ? 'ਕੀੜੇ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ' :
           'Upload Pest Photo'}
        </h2>
        <p className="text-muted-foreground font-inter">
          {language === 'hi' ? 'स्पष्ट और अच्छी रोशनी वाली फोटो अपलोड करें' :
           language === 'pa' ? 'ਸਪਸ਼ਟ ਅਤੇ ਚੰਗੀ ਰੋਸ਼ਨੀ ਵਾਲੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ' :
           'Upload a clear photo with good lighting'}
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragActive 
            ? 'border-voice-active bg-voice-active/5' 
            : 'border-muted-foreground/30 hover:border-voice-active hover:bg-voice-active/5'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-voice-active to-voice-listening rounded-full flex items-center justify-center">
            <Camera className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <h3 className="text-lg font-poppins font-semibold text-foreground mb-2">
              {language === 'hi' ? 'फोटो अपलोड करें' :
               language === 'pa' ? 'ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ' :
               'Upload Photo'}
            </h3>
            <p className="text-sm text-muted-foreground font-inter mb-4">
              {language === 'hi' ? 'फोटो को यहां खींचें या क्लिक करके चुनें' :
               language === 'pa' ? 'ਫੋਟੋ ਨੂੰ ਇੱਥੇ ਖਿੱਚੋ ਜਾਂ ਕਲਿੱਕ ਕਰਕੇ ਚੁਣੋ' :
               'Drag photo here or click to select'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-field text-white hover:shadow-medium font-inter"
            >
              <Upload className="w-4 h-4 mr-2" />
              {language === 'hi' ? 'फोटो चुनें' : language === 'pa' ? 'ਫੋਟੋ ਚੁਣੋ' : 'Choose Photo'}
            </Button>
            <Button
              variant="outline"
              className="font-inter"
            >
              <Camera className="w-4 h-4 mr-2" />
              {language === 'hi' ? 'कैमरा खोलें' : language === 'pa' ? 'ਕੈਮਰਾ ਖੋਲ੍ਹੋ' : 'Open Camera'}
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Tips */}
      <Card className="border-0 shadow-soft bg-sky-50/50">
        <CardContent className="p-4">
          <h4 className="font-poppins font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-harvest-500" />
            {language === 'hi' ? '💡 टिप्स:' : language === 'pa' ? '💡 ਸੁਝਾਅ:' : '💡 Tips:'}
          </h4>
          <ul className="text-xs text-muted-foreground font-inter space-y-1">
            <li>• {language === 'hi' ? 'अच्छी रोशनी में फोटो लें' : language === 'pa' ? 'ਚੰਗੀ ਰੋਸ਼ਨੀ ਵਿੱਚ ਫੋਟੋ ਲਓ' : 'Take photo in good lighting'}</li>
            <li>• {language === 'hi' ? 'कीट को क्लोज-अप में दिखाएं' : language === 'pa' ? 'ਕੀੜੇ ਨੂੰ ਕਲੋਜ-ਅਪ ਵਿੱਚ ਦਿਖਾਓ' : 'Show pest in close-up'}</li>
            <li>• {language === 'hi' ? 'पत्तियों के नुकसान को भी दिखाएं' : language === 'pa' ? 'ਪੱਤਿਆਂ ਦੇ ਨੁਕਸਾਨ ਨੂੰ ਵੀ ਦਿਖਾਓ' : 'Also show leaf damage'}</li>
            <li>• {language === 'hi' ? 'स्पष्ट और धुंधली न हो' : language === 'pa' ? 'ਸਪਸ਼ਟ ਅਤੇ ਧੁੰਦਲੀ ਨਾ ਹੋਵੇ' : 'Clear and not blurry'}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="text-center py-12">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-voice-processing to-voice-active rounded-full flex items-center justify-center animate-pulse">
        <Bug className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-2xl font-poppins font-bold text-forest-500 mb-2">
        {language === 'hi' ? 'कीट की पहचान कर रहे हैं...' :
         language === 'pa' ? 'ਕੀੜੇ ਦੀ ਪਛਾਣ ਕਰ ਰਹੇ ਹਾਂ...' :
         'Identifying Pest...'}
      </h2>
      <p className="text-muted-foreground font-inter mb-6">
        {language === 'hi' ? 'AI आपकी फोटो का विश्लेषण कर रहा है' :
         language === 'pa' ? 'AI ਤੁਹਾਡੀ ਫੋਟੋ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹੈ' :
         'AI is analyzing your photo'}
      </p>
      
      <div className="max-w-md mx-auto">
        <Progress value={75} className="mb-4" />
        <div className="flex justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-voice-processing rounded-full animate-voice-wave"
              style={{
                height: `${20 + i * 8}px`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderResultsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-poppins font-bold text-forest-500 mb-2">
          {language === 'hi' ? 'कीट पहचान परिणाम' :
           language === 'pa' ? 'ਕੀੜੇ ਪਛਾਣ ਨਤੀਜੇ' :
           'Pest Detection Results'}
        </h2>
        <p className="text-muted-foreground font-inter">
          {language === 'hi' ? 'आपकी फोटो में पाए गए कीट' :
           language === 'pa' ? 'ਤੁਹਾਡੀ ਫੋਟੋ ਵਿੱਚ ਮਿਲੇ ਕੀੜੇ' :
           'Pests found in your photo'}
        </p>
      </div>

      {/* Image Preview */}
      {selectedImage && (
        <Card className="border-0 shadow-medium bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="font-poppins font-semibold text-lg text-foreground mb-3">
                {language === 'hi' ? 'अपलोड की गई फोटो' : language === 'pa' ? 'ਅਪਲੋਡ ਕੀਤੀ ਗਈ ਫੋਟੋ' : 'Uploaded Photo'}
              </h3>
              <div className="relative inline-block">
                <img
                  src={selectedImage}
                  alt="Uploaded pest"
                  className="max-w-full h-64 object-cover rounded-lg shadow-medium"
                />
                <div className="absolute top-2 right-2 bg-white/90 rounded-full p-2">
                  <Eye className="w-4 h-4 text-forest-600" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <div className="space-y-4">
        {results.map((pest, index) => (
          <Card key={pest.id} className="border-0 shadow-medium bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{pest.image}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-poppins font-bold text-forest-500">{pest.nameNative}</h3>
                    <Badge variant="outline" className={`${getSeverityColor(pest.severity)} font-inter`}>
                      {getSeverityText(pest.severity)}
                    </Badge>
                    <Badge variant="outline" className="bg-voice-active/10 text-voice-active border-voice-active/20">
                      {pest.confidence}% {language === 'hi' ? 'सटीक' : language === 'pa' ? 'ਸਟੀਕ' : 'Confidence'}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground font-inter mb-4">{pest.description}</p>
                  
                  {/* Affected Area */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-warning" />
                      <span className="text-sm font-inter font-medium text-foreground">
                        {language === 'hi' ? 'प्रभावित क्षेत्र' : language === 'pa' ? 'ਪ੍ਰਭਾਵਿਤ ਖੇਤਰ' : 'Affected Area'}: {pest.affectedArea}%
                      </span>
                    </div>
                    <Progress value={pest.affectedArea} className="h-2" />
                  </div>

                  {/* Symptoms */}
                  <div className="mb-4">
                    <h4 className="font-poppins font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-warning" />
                      {language === 'hi' ? 'लक्षण' : language === 'pa' ? 'ਲੱਛਣ' : 'Symptoms'}
                    </h4>
                    <ul className="space-y-1">
                      {pest.symptoms.map((symptom, i) => (
                        <li key={i} className="text-sm text-muted-foreground font-inter flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-warning rounded-full" />
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Treatment Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Organic Treatment */}
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-poppins font-semibold text-sm text-green-700 mb-2 flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        {language === 'hi' ? 'जैविक उपचार' : language === 'pa' ? 'ਜੈਵਿਕ ਇਲਾਜ' : 'Organic Treatment'}
                      </h4>
                      <ul className="space-y-1">
                        {pest.treatment.organic.map((treatment, i) => (
                          <li key={i} className="text-xs text-green-600 font-inter">
                            • {treatment}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Chemical Treatment */}
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <h4 className="font-poppins font-semibold text-sm text-orange-700 mb-2 flex items-center gap-2">
                        <Droplets className="w-4 h-4" />
                        {language === 'hi' ? 'रासायनिक उपचार' : language === 'pa' ? 'ਰਸਾਇਣਿਕ ਇਲਾਜ' : 'Chemical Treatment'}
                      </h4>
                      <ul className="space-y-1">
                        {pest.treatment.chemical.map((treatment, i) => (
                          <li key={i} className="text-xs text-orange-600 font-inter">
                            • {treatment}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Preventive Measures */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-poppins font-semibold text-sm text-blue-700 mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        {language === 'hi' ? 'रोकथाम' : language === 'pa' ? 'ਰੋਕਥਾਮ' : 'Prevention'}
                      </h4>
                      <ul className="space-y-1">
                        {pest.treatment.preventive.map((prevention, i) => (
                          <li key={i} className="text-xs text-blue-600 font-inter">
                            • {prevention}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={() => setCurrentStep('upload')}
          className="bg-gradient-field text-white hover:shadow-medium font-inter"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          {language === 'hi' ? 'नई फोटो अपलोड करें' : language === 'pa' ? 'ਨਵੀਂ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ' : 'Upload New Photo'}
        </Button>
        <Button
          variant="outline"
          className="font-inter"
        >
          <Download className="w-4 h-4 mr-2" />
          {language === 'hi' ? 'रिपोर्ट डाउनलोड करें' : language === 'pa' ? 'ਰਿਪੋਰਟ ਡਾਉਨਲੋਡ ਕਰੋ' : 'Download Report'}
        </Button>
        <Button
          variant="outline"
          className="font-inter"
        >
          <Share2 className="w-4 h-4 mr-2" />
          {language === 'hi' ? 'साझा करें' : language === 'pa' ? 'ਸਾਂਝਾ ਕਰੋ' : 'Share'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-background to-forest-50">
      {/* Header */}
      <div className="bg-gradient-field text-white p-4 shadow-medium">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'hi' ? 'वापस' : language === 'pa' ? 'ਵਾਪਸ' : 'Back'}
            </Button>
            <div>
              <h1 className="text-lg font-poppins font-bold">
                {language === 'hi' ? 'कीट पहचान' : language === 'pa' ? 'ਕੀੜੇ ਪਛਾਣ' : 'Pest Detection'}
              </h1>
              <p className="text-sm opacity-90 font-inter">
                {language === 'hi' ? 'AI-संचालित कीट पहचान' : language === 'pa' ? 'AI-ਸੰਚਾਲਿਤ ਕੀੜੇ ਪਛਾਣ' : 'AI-Powered Pest Detection'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-inter opacity-90">
              {currentStep === 'upload' && (language === 'hi' ? 'अपलोड' : language === 'pa' ? 'ਅਪਲੋਡ' : 'Upload')}
              {currentStep === 'processing' && (language === 'hi' ? 'प्रोसेसिंग' : language === 'pa' ? 'ਪ੍ਰੋਸੈਸਿੰਗ' : 'Processing')}
              {currentStep === 'results' && (language === 'hi' ? 'परिणाम' : language === 'pa' ? 'ਨਤੀਜੇ' : 'Results')}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-medium bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              {currentStep === 'upload' && renderUploadStep()}
              {currentStep === 'processing' && renderProcessingStep()}
              {currentStep === 'results' && renderResultsStep()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PestDetection;