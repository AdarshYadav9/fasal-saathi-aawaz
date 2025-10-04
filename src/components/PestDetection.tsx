import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Camera, Upload, RefreshCw, Bug, Leaf } from 'lucide-react';

interface PestDetectionProps {
  language: string;
}

interface DetectionResult {
  issue: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  treatment: string[];
  prevention: string[];
  organicSolutions: string[];
}

export const PestDetection = ({ language }: PestDetectionProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const translations = {
    en: {
      title: 'Pest & Disease Detection',
      subtitle: 'Upload crop images for AI-powered pest and disease identification',
      uploadImage: 'Upload Image',
      takePhoto: 'Take Photo',
      analyzing: 'Analyzing image...',
      noImageSelected: 'No image selected',
      selectImageFirst: 'Please select an image first',
      detected: 'Detected Issue',
      confidence: 'Confidence',
      severity: 'Severity',
      treatment: 'Treatment Options',
      prevention: 'Prevention Tips',
      organicSolutions: 'Organic Solutions',
      analyzeAnother: 'Analyze Another Image',
      severityLevels: {
        low: 'Low Risk',
        medium: 'Medium Risk',
        high: 'High Risk'
      }
    },
    hi: {
      title: 'कीट और रोग पहचान',
      subtitle: 'कीट और रोग की पहचान के लिए AI-संचालित फसल छवियां अपलोड करें',
      uploadImage: 'छवि अपलोड करें',
      takePhoto: 'फोटो लें',
      analyzing: 'छवि का विश्लेषण कर रहे हैं...',
      noImageSelected: 'कोई छवि चयनित नहीं',
      selectImageFirst: 'कृपया पहले एक छवि चुनें',
      detected: 'पहचानी गई समस्या',
      confidence: 'विश्वास',
      severity: 'गंभीरता',
      treatment: 'उपचार विकल्प',
      prevention: 'रोकथाम के टिप्स',
      organicSolutions: 'जैविक समाधान',
      analyzeAnother: 'दूसरी छवि का विश्लेषण करें',
      severityLevels: {
        low: 'कम जोखिम',
        medium: 'मध्यम जोखिम',
        high: 'उच्च जोखिम'
      }
    },
    pa: {
      title: 'ਕੀੜੇ ਅਤੇ ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ',
      subtitle: 'ਕੀੜੇ ਅਤੇ ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ ਲਈ AI-ਸੰਚਾਲਿਤ ਫਸਲ ਤਸਵੀਰਾਂ ਅਪਲੋਡ ਕਰੋ',
      uploadImage: 'ਤਸਵੀਰ ਅਪਲੋਡ ਕਰੋ',
      takePhoto: 'ਫੋਟੋ ਲਓ',
      analyzing: 'ਤਸਵੀਰ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਹੇ ਹਾਂ...',
      noImageSelected: 'ਕੋਈ ਤਸਵੀਰ ਚੁਣੀ ਨਹੀਂ',
      selectImageFirst: 'ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਇੱਕ ਤਸਵੀਰ ਚੁਣੋ',
      detected: 'ਪਛਾਣੀ ਗਈ ਸਮੱਸਿਆ',
      confidence: 'ਭਰੋਸਾ',
      severity: 'ਗੰਭੀਰਤਾ',
      treatment: 'ਇਲਾਜ ਦੇ ਵਿਕਲਪ',
      prevention: 'ਰੋਕਥਾਮ ਦੇ ਟਿਪਸ',
      organicSolutions: 'ਜੈਵਿਕ ਹੱਲ',
      analyzeAnother: 'ਕਿਸੇ ਹੋਰ ਤਸਵੀਰ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ',
      severityLevels: {
        low: 'ਘੱਟ ਜੋਖਮ',
        medium: 'ਮੱਧਮ ਜੋਖਮ',
        high: 'ਉੱਚ ਜੋਖਮ'
      }
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const mockDetectionResults = {
    en: [
      {
        issue: 'Leaf Blight (Alternaria alternata)',
        confidence: 87,
        severity: 'medium' as const,
        treatment: [
          'Apply copper-based fungicide spray',
          'Remove affected leaves immediately',
          'Ensure proper crop spacing for air circulation',
          'Apply Propiconazole 25% EC @ 1ml/L water'
        ],
        prevention: [
          'Use disease-resistant crop varieties',
          'Avoid overhead irrigation',
          'Maintain proper field hygiene',
          'Rotate crops every season'
        ],
        organicSolutions: [
          'Neem oil spray (5ml/L water)',
          'Baking soda solution (5g/L water)',
          'Trichoderma viride application',
          'Compost tea foliar spray'
        ]
      },
      {
        issue: 'Aphid Infestation (Myzus persicae)',
        confidence: 92,
        severity: 'high' as const,
        treatment: [
          'Apply Imidacloprid 17.8% SL @ 0.3ml/L',
          'Use yellow sticky traps',
          'Spray insecticidal soap solution',
          'Release ladybird beetles as biocontrol'
        ],
        prevention: [
          'Regular monitoring of crops',
          'Remove weeds around the field',
          'Use reflective mulch',
          'Plant companion crops like marigold'
        ],
        organicSolutions: [
          'Neem oil spray every 7 days',
          'Garlic-chili spray solution',
          'Introduce natural predators',
          'Diatomaceous earth application'
        ]
      }
    ],
    hi: [
      {
        issue: 'पत्ती का झुलसना (अल्टरनेरिया अल्टरनेटा)',
        confidence: 87,
        severity: 'medium' as const,
        treatment: [
          'तांबा आधारित कवकनाशी स्प्रे लगाएं',
          'प्रभावित पत्तियों को तुरंत हटाएं',
          'हवा के संचलन के लिए उचित फसल दूरी सुनिश्चित करें',
          'प्रोपिकोनाजोल 25% EC @ 1ml/L पानी लगाएं'
        ],
        prevention: [
          'रोग प्रतिरोधी फसल किस्मों का उपयोग करें',
          'ऊपरी सिंचाई से बचें',
          'उचित खेत स्वच्छता बनाए रखें',
          'हर मौसम में फसल चक्र करें'
        ],
        organicSolutions: [
          'नीम का तेल स्प्रे (5ml/L पानी)',
          'बेकिंग सोडा घोल (5g/L पानी)',
          'ट्राइकोडर्मा विराइड का प्रयोग',
          'कंपोस्ट चाय पत्तियों पर छिड़काव'
        ]
      }
    ],
    pa: [
      {
        issue: 'ਪੱਤੇ ਸੜਨਾ (ਅਲਟਰਨੇਰੀਆ ਅਲਟਰਨਾਟਾ)',
        confidence: 87,
        severity: 'medium' as const,
        treatment: [
          'ਤਾਂਬਾ ਆਧਾਰਿਤ ਫੰਗੀਸਾਈਡ ਸਪ੍ਰੇ ਲਗਾਓ',
          'ਪ੍ਰਭਾਵਿਤ ਪੱਤਿਆਂ ਨੂੰ ਤੁਰੰਤ ਹਟਾਓ',
          'ਹਵਾ ਦੇ ਗੇੜ ਲਈ ਸਹੀ ਫਸਲ ਦੂਰੀ ਯਕੀਨੀ ਬਣਾਓ',
          'ਪ੍ਰੋਪਿਕੋਨਾਜ਼ੋਲ 25% EC @ 1ml/L ਪਾਣੀ ਲਗਾਓ'
        ],
        prevention: [
          'ਬਿਮਾਰੀ ਪ੍ਰਤੀਰੋਧੀ ਫਸਲ ਕਿਸਮਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ',
          'ਉੱਪਰਲੀ ਸਿੰਚਾਈ ਤੋਂ ਬਚੋ',
          'ਸਹੀ ਖੇਤ ਸਫਾਈ ਬਣਾਈ ਰੱਖੋ',
          'ਹਰ ਮੌਸਮ ਵਿੱਚ ਫਸਲ ਚੱਕਰ ਕਰੋ'
        ],
        organicSolutions: [
          'ਨਿੰਬ ਦਾ ਤੇਲ ਸਪ੍ਰੇ (5ml/L ਪਾਣੀ)',
          'ਬੇਕਿੰਗ ਸੋਡਾ ਘੋਲ (5g/L ਪਾਣੀ)',
          'ਟ੍ਰਾਈਕੋਡਰਮਾ ਵਿਰਾਇਡ ਦਾ ਪ੍ਰਯੋਗ',
          'ਕੰਪੋਸਟ ਚਾਹ ਪੱਤਿਆਂ ਤੇ ਛਿੜਕਾਵ'
        ]
      }
    ]
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setDetectionResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setDetectionResult(null);

    // Simulate AI analysis with progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));

    clearInterval(progressInterval);
    setAnalysisProgress(100);

    // Mock result
    const results = mockDetectionResults[language as keyof typeof mockDetectionResults] || mockDetectionResults.en;
    const randomResult = results[Math.floor(Math.random() * results.length)];
    
    setTimeout(() => {
      setDetectionResult(randomResult);
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }, 500);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-success text-success-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'high': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
          <Bug className="w-6 h-6 sm:w-8 sm:h-8" />
          {t.title}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Image Upload Section */}
      <Card className="p-6 shadow-medium">
        <div className="flex flex-col items-center space-y-4">
          {selectedImage ? (
            <div className="relative w-full max-w-md">
              <img
                src={selectedImage}
                alt="Selected crop"
                className="w-full h-48 sm:h-64 object-cover rounded-lg shadow-soft"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center space-y-2">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto" />
                    <p>{t.analyzing}</p>
                    <Progress value={analysisProgress} className="w-3/4 max-w-sm" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full max-w-md h-64 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Leaf className="w-12 h-12 mx-auto mb-2" />
                <p>{t.noImageSelected}</p>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              variant="field"
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
            >
              <Upload className="w-4 h-4 mr-2" />
              {t.uploadImage}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                // In a real app, this would open camera
                fileInputRef.current?.click();
              }}
              disabled={isAnalyzing}
            >
              <Camera className="w-4 h-4 mr-2" />
              {t.takePhoto}
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {selectedImage && !isAnalyzing && (
            <Button
              variant="hero"
              size="lg"
              onClick={analyzeImage}
              className="w-full max-w-md"
            >
              Analyze Image 🔍
            </Button>
          )}
        </div>
      </Card>

      {/* Detection Results */}
      {detectionResult && (
        <Card className="p-6 shadow-strong border-warning/20">
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-2xl font-bold text-primary">{t.detected}</h3>
              <div className="flex gap-2">
                <Badge className="bg-primary text-primary-foreground">
                  {t.confidence}: {detectionResult.confidence}%
                </Badge>
                <Badge className={getSeverityColor(detectionResult.severity)}>
                  {t.severity}: {t.severityLevels[detectionResult.severity]}
                </Badge>
              </div>
            </div>

            <div className="text-center p-4 bg-warning/10 rounded-lg border border-warning/20">
              <h4 className="text-xl font-bold text-warning-foreground mb-2">
                {detectionResult.issue}
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                  💊 {t.treatment}
                </h4>
                <ul className="space-y-2">
                  {detectionResult.treatment.map((item, index) => (
                    <li key={index} className="text-sm bg-card p-2 rounded border-l-4 border-destructive">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                  🛡️ {t.prevention}
                </h4>
                <ul className="space-y-2">
                  {detectionResult.prevention.map((item, index) => (
                    <li key={index} className="text-sm bg-card p-2 rounded border-l-4 border-warning">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                  🌿 {t.organicSolutions}
                </h4>
                <ul className="space-y-2">
                  {detectionResult.organicSolutions.map((item, index) => (
                    <li key={index} className="text-sm bg-card p-2 rounded border-l-4 border-success">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Button
              variant="field"
              size="lg"
              className="w-full"
              onClick={() => {
                setSelectedImage(null);
                setDetectionResult(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
            >
              {t.analyzeAnother}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};