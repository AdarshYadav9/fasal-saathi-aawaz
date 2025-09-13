import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Thermometer, Droplets, Calendar } from 'lucide-react';

interface CropRecommendationProps {
  language: string;
}

interface RecommendationData {
  location: string;
  soilType: string;
  cropType: string;
  season: string;
  additionalInfo: string;
}

interface Recommendation {
  crop: string;
  confidence: number;
  reasons: string[];
  tips: string[];
  expectedYield: string;
  marketPrice: string;
}

export const CropRecommendation = ({ language }: CropRecommendationProps) => {
  const [formData, setFormData] = useState<RecommendationData>({
    location: '',
    soilType: '',
    cropType: '',
    season: '',
    additionalInfo: '',
  });
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const translations = {
    en: {
      title: 'Crop Recommendation System',
      subtitle: 'Get personalized crop suggestions based on your farm conditions',
      location: 'Location (Village/District)',
      locationPlaceholder: 'Enter your village or district name',
      soilType: 'Soil Type',
      soilPlaceholder: 'Select your soil type',
      cropType: 'Preferred Crop Category',
      cropPlaceholder: 'Select crop category',
      season: 'Planting Season',
      seasonPlaceholder: 'Select planting season',
      additionalInfo: 'Additional Information',
      additionalPlaceholder: 'Any specific requirements or constraints...',
      getRecommendation: 'Get Crop Recommendation',
      processing: 'Analyzing your farm conditions...',
      recommendedCrop: 'Recommended Crop',
      confidence: 'Confidence Score',
      reasons: 'Why this crop?',
      tips: 'Farming Tips',
      expectedYield: 'Expected Yield',
      marketPrice: 'Current Market Price',
    },
    hi: {
      title: 'फसल सिफारिश प्रणाली',
      subtitle: 'अपनी खेती की स्थिति के आधार पर व्यक्तिगत फसल सुझाव प्राप्त करें',
      location: 'स्थान (गांव/जिला)',
      locationPlaceholder: 'अपना गांव या जिला नाम दर्ज करें',
      soilType: 'मिट्टी का प्रकार',
      soilPlaceholder: 'अपनी मिट्टी का प्रकार चुनें',
      cropType: 'पसंदीदा फसल श्रेणी',
      cropPlaceholder: 'फसल श्रेणी चुनें',
      season: 'बुवाई का मौसम',
      seasonPlaceholder: 'बुवाई का मौसम चुनें',
      additionalInfo: 'अतिरिक्त जानकारी',
      additionalPlaceholder: 'कोई विशेष आवश्यकताएं या बाधाएं...',
      getRecommendation: 'फसल सिफारिश प्राप्त करें',
      processing: 'आपकी खेती की स्थिति का विश्लेषण कर रहे हैं...',
      recommendedCrop: 'सिफारिश की गई फसल',
      confidence: 'विश्वास स्कोर',
      reasons: 'यह फसल क्यों?',
      tips: 'खेती के टिप्स',
      expectedYield: 'अपेक्षित उत्पादन',
      marketPrice: 'वर्तमान बाजार भाव',
    },
    pa: {
      title: 'ਫਸਲ ਸਿਫਾਰਸ਼ ਪ੍ਰਣਾਲੀ',
      subtitle: 'ਆਪਣੇ ਖੇਤ ਦੀਆਂ ਸਥਿਤੀਆਂ ਦੇ ਆਧਾਰ ਤੇ ਵਿਅਕਤੀਗਤ ਫਸਲ ਸੁਝਾਅ ਪ੍ਰਾਪਤ ਕਰੋ',
      location: 'ਸਥਾਨ (ਪਿੰਡ/ਜ਼ਿਲ੍ਹਾ)',
      locationPlaceholder: 'ਆਪਣਾ ਪਿੰਡ ਜਾਂ ਜ਼ਿਲ੍ਹਾ ਨਾਮ ਦਰਜ ਕਰੋ',
      soilType: 'ਮਿੱਟੀ ਦੀ ਕਿਸਮ',
      soilPlaceholder: 'ਆਪਣੀ ਮਿੱਟੀ ਦੀ ਕਿਸਮ ਚੁਣੋ',
      cropType: 'ਪਸੰਦੀਦਾ ਫਸਲ ਸ਼੍ਰੇਣੀ',
      cropPlaceholder: 'ਫਸਲ ਸ਼੍ਰੇਣੀ ਚੁਣੋ',
      season: 'ਬੀਜਾਈ ਦਾ ਮੌਸਮ',
      seasonPlaceholder: 'ਬੀਜਾਈ ਦਾ ਮੌਸਮ ਚੁਣੋ',
      additionalInfo: 'ਅਤਿਰਿਕਤ ਜਾਣਕਾਰੀ',
      additionalPlaceholder: 'ਕੋਈ ਖਾਸ ਲੋੜਾਂ ਜਾਂ ਰੁਕਾਵਟਾਂ...',
      getRecommendation: 'ਫਸਲ ਸਿਫਾਰਸ਼ ਪ੍ਰਾਪਤ ਕਰੋ',
      processing: 'ਤੁਹਾਡੇ ਖੇਤ ਦੀਆਂ ਸਥਿਤੀਆਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਹੇ ਹਾਂ...',
      recommendedCrop: 'ਸਿਫਾਰਸ਼ ਕੀਤੀ ਫਸਲ',
      confidence: 'ਭਰੋਸਾ ਸਕੋਰ',
      reasons: 'ਇਹ ਫਸਲ ਕਿਉਂ?',
      tips: 'ਖੇਤੀ ਦੇ ਟਿਪਸ',
      expectedYield: 'ਅਪੇਖਿਤ ਪੈਦਾਵਾਰ',
      marketPrice: 'ਮੌਜੂਦਾ ਬਾਜ਼ਾਰ ਭਾਅ',
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const soilTypes = {
    en: ['Clay', 'Sandy', 'Loamy', 'Black Cotton', 'Red Soil', 'Alluvial'],
    hi: ['चिकनी मिट्टी', 'बलुई मिट्टी', 'दोमट मिट्टी', 'काली कपास मिट्टी', 'लाल मिट्टी', 'जलोढ़ मिट्टी'],
    pa: ['ਚਿੱਕੜ ਮਿੱਟੀ', 'ਰੇਤਲੀ ਮਿੱਟੀ', 'ਦੋਆਬਾ ਮਿੱਟੀ', 'ਕਾਲੀ ਕਪਾਹ ਮਿੱਟੀ', 'ਲਾਲ ਮਿੱਟੀ', 'ਜਲੋਢ਼ ਮਿੱਟੀ'],
  };

  const cropCategories = {
    en: ['Cereals', 'Pulses', 'Vegetables', 'Fruits', 'Cash Crops', 'Spices'],
    hi: ['अनाज', 'दालें', 'सब्जियां', 'फल', 'नकदी फसलें', 'मसाले'],
    pa: ['ਅਨਾਜ', 'ਦਾਲਾਂ', 'ਸਬਜ਼ੀਆਂ', 'ਫਲ', 'ਨਕਦੀ ਫਸਲਾਂ', 'ਮਸਾਲੇ'],
  };

  const seasons = {
    en: ['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)', 'Year Round'],
    hi: ['खरीफ (मानसून)', 'रबी (सर्दी)', 'जायद (गर्मी)', 'साल भर'],
    pa: ['ਖਰੀਫ (ਮਾਨਸੂਨ)', 'ਰਬੀ (ਸਿਆਲ)', 'ਜ਼ਾਇਦ (ਗਰਮੀ)', 'ਸਾਲ ਭਰ'],
  };

  const generateRecommendation = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock recommendation based on inputs
    const mockRecommendations = {
      en: {
        crop: 'Wheat (HD-2967)',
        confidence: 92,
        reasons: [
          'Excellent match for your soil type and climate',
          'High market demand in your region',
          'Suitable for current season planting',
          'Good water efficiency for your area'
        ],
        tips: [
          'Plant between 15th November to 15th December',
          'Use 100-120 kg seeds per hectare',
          'Apply fertilizer in 3 stages',
          'Irrigate 4-6 times during growing season'
        ],
        expectedYield: '45-50 quintals per hectare',
        marketPrice: '₹2,100-2,300 per quintal'
      },
      hi: {
        crop: 'गेहूं (एचडी-2967)',
        confidence: 92,
        reasons: [
          'आपकी मिट्टी और जलवायु के लिए उत्कृष्ट मेल',
          'आपके क्षेत्र में उच्च बाजार मांग',
          'वर्तमान मौसम की बुवाई के लिए उपयुक्त',
          'आपके क्षेत्र के लिए अच्छी पानी की दक्षता'
        ],
        tips: [
          '15 नवंबर से 15 दिसंबर के बीच बुवाई करें',
          'प्रति हेक्टेयर 100-120 किलो बीज का उपयोग करें',
          'उर्वरक को 3 चरणों में डालें',
          'बढ़ते मौसम में 4-6 बार सिंचाई करें'
        ],
        expectedYield: '45-50 क्विंटल प्रति हेक्टेयर',
        marketPrice: '₹2,100-2,300 प्रति क्विंटल'
      },
      pa: {
        crop: 'ਕਣਕ (ਐਚਡੀ-2967)',
        confidence: 92,
        reasons: [
          'ਤੁਹਾਡੀ ਮਿੱਟੀ ਅਤੇ ਜਲਵਾਯੂ ਲਈ ਸ਼ਾਨਦਾਰ ਮੇਲ',
          'ਤੁਹਾਡੇ ਖੇਤਰ ਵਿੱਚ ਉੱਚ ਬਾਜ਼ਾਰ ਮੰਗ',
          'ਮੌਜੂਦਾ ਮੌਸਮ ਦੀ ਬੀਜਾਈ ਲਈ ਢੁਕਵਾਂ',
          'ਤੁਹਾਡੇ ਖੇਤਰ ਲਈ ਚੰਗੀ ਪਾਣੀ ਦੀ ਕੁਸ਼ਲਤਾ'
        ],
        tips: [
          '15 ਨਵੰਬਰ ਤੋਂ 15 ਦਸੰਬਰ ਦੇ ਵਿਚਕਾਰ ਬੀਜਾਈ ਕਰੋ',
          'ਪ੍ਰਤੀ ਹੈਕਟੇਅਰ 100-120 ਕਿਲੋ ਬੀਜ ਦੀ ਵਰਤੋਂ ਕਰੋ',
          'ਖਾਦ ਨੂੰ 3 ਪੜਾਵਾਂ ਵਿੱਚ ਪਾਓ',
          'ਵਧਣ ਦੇ ਮੌਸਮ ਵਿੱਚ 4-6 ਵਾਰ ਸਿੰਚਾਈ ਕਰੋ'
        ],
        expectedYield: '45-50 ਕੁਇੰਟਲ ਪ੍ਰਤੀ ਹੈਕਟੇਅਰ',
        marketPrice: '₹2,100-2,300 ਪ੍ਰਤੀ ਕੁਇੰਟਲ'
      }
    };

    setRecommendation(mockRecommendations[language as keyof typeof mockRecommendations] || mockRecommendations.en);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
          🌾 {t.title}
        </h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Form */}
      <Card className="p-6 shadow-medium">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {t.location}
            </Label>
            <Input
              id="location"
              placeholder={t.locationPlaceholder}
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Thermometer className="w-4 h-4" />
              {t.soilType}
            </Label>
            <Select onValueChange={(value) => setFormData({...formData, soilType: value})}>
              <SelectTrigger>
                <SelectValue placeholder={t.soilPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {(soilTypes[language as keyof typeof soilTypes] || soilTypes.en).map((soil, index) => (
                  <SelectItem key={index} value={soil}>{soil}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              {t.cropType}
            </Label>
            <Select onValueChange={(value) => setFormData({...formData, cropType: value})}>
              <SelectTrigger>
                <SelectValue placeholder={t.cropPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {(cropCategories[language as keyof typeof cropCategories] || cropCategories.en).map((crop, index) => (
                  <SelectItem key={index} value={crop}>{crop}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {t.season}
            </Label>
            <Select onValueChange={(value) => setFormData({...formData, season: value})}>
              <SelectTrigger>
                <SelectValue placeholder={t.seasonPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {(seasons[language as keyof typeof seasons] || seasons.en).map((season, index) => (
                  <SelectItem key={index} value={season}>{season}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <Label htmlFor="additional">{t.additionalInfo}</Label>
          <Textarea
            id="additional"
            placeholder={t.additionalPlaceholder}
            value={formData.additionalInfo}
            onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
          />
        </div>

        <Button
          variant="hero"
          size="lg"
          className="w-full mt-6"
          onClick={generateRecommendation}
          disabled={isLoading || !formData.location || !formData.soilType}
        >
          {isLoading ? t.processing : t.getRecommendation}
        </Button>
      </Card>

      {/* Recommendation Results */}
      {recommendation && (
        <Card className="p-6 shadow-strong bg-gradient-sky border-success/20">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-primary">{t.recommendedCrop}</h3>
              <Badge className="bg-success text-success-foreground text-lg px-4 py-2">
                {t.confidence}: {recommendation.confidence}%
              </Badge>
            </div>

            <div className="text-center p-4 bg-success/10 rounded-lg">
              <div className="text-3xl font-bold text-success mb-2">{recommendation.crop}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>{t.expectedYield}:</strong> {recommendation.expectedYield}
                </div>
                <div>
                  <strong>{t.marketPrice}:</strong> {recommendation.marketPrice}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-primary mb-3">{t.reasons}</h4>
                <ul className="space-y-2">
                  {recommendation.reasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-success font-bold">✓</span>
                      <span className="text-sm">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-primary mb-3">{t.tips}</h4>
                <ul className="space-y-2">
                  {recommendation.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-warning font-bold">💡</span>
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};