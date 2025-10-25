import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  MapPin, 
  Calendar, 
  Droplets, 
  Thermometer,
  Sun,
  Wind,
  Soil,
  Sprout,
  TrendingUp,
  AlertCircle,
  Info,
  Star,
  Clock,
  DollarSign
} from 'lucide-react';

interface CropRecommendationProps {
  language: string;
  onBack: () => void;
}

interface SoilType {
  id: string;
  name: string;
  nameNative: string;
  description: string;
  image: string;
  color: string;
}

interface Crop {
  id: string;
  name: string;
  nameNative: string;
  season: string;
  duration: string;
  yield: string;
  price: string;
  suitability: number;
  description: string;
  requirements: string[];
  benefits: string[];
  image: string;
}

const CropRecommendation: React.FC<CropRecommendationProps> = ({ language, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    location: '',
    soilType: '',
    season: '',
    area: '',
    budget: '',
    experience: '',
    irrigation: '',
    climate: ''
  });
  const [recommendations, setRecommendations] = useState<Crop[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const soilTypes: SoilType[] = [
    {
      id: 'alluvial',
      name: 'Alluvial Soil',
      nameNative: language === 'hi' ? 'जलोढ़ मिट्टी' : language === 'pa' ? 'ਜਲੋੜ ਮਿੱਟੀ' : 'Alluvial Soil',
      description: language === 'hi' ? 'नदियों द्वारा बहाकर लाई गई उपजाऊ मिट्टी' : 
                   language === 'pa' ? 'ਨਦੀਆਂ ਦੁਆਰਾ ਵਹਾਇਆ ਗਿਆ ਉਪਜਾਊ ਮਿੱਟੀ' : 
                   'Fertile soil deposited by rivers',
      image: '🌊',
      color: 'bg-blue-100 border-blue-300'
    },
    {
      id: 'black',
      name: 'Black Soil',
      nameNative: language === 'hi' ? 'काली मिट्टी' : language === 'pa' ? 'ਕਾਲੀ ਮਿੱਟੀ' : 'Black Soil',
      description: language === 'hi' ? 'कपास और गन्ने के लिए उपयुक्त' : 
                   language === 'pa' ? 'ਕਪਾਹ ਅਤੇ ਗੰਨੇ ਲਈ ਉਪਯੁਕਤ' : 
                   'Suitable for cotton and sugarcane',
      image: '🖤',
      color: 'bg-gray-100 border-gray-300'
    },
    {
      id: 'red',
      name: 'Red Soil',
      nameNative: language === 'hi' ? 'लाल मिट्टी' : language === 'pa' ? 'ਲਾਲ ਮਿੱਟੀ' : 'Red Soil',
      description: language === 'hi' ? 'दक्षिण भारत में पाई जाने वाली मिट्टी' : 
                   language === 'pa' ? 'ਦੱਖਣ ਭਾਰਤ ਵਿੱਚ ਮਿਲਣ ਵਾਲੀ ਮਿੱਟੀ' : 
                   'Found in South India',
      image: '🔴',
      color: 'bg-red-100 border-red-300'
    },
    {
      id: 'loamy',
      name: 'Loamy Soil',
      nameNative: language === 'hi' ? 'दोमट मिट्टी' : language === 'pa' ? 'ਦੋਮਟ ਮਿੱਟੀ' : 'Loamy Soil',
      description: language === 'hi' ? 'सबसे उपजाऊ मिट्टी, सभी फसलों के लिए उपयुक्त' : 
                   language === 'pa' ? 'ਸਭ ਤੋਂ ਉਪਜਾਊ ਮਿੱਟੀ, ਸਾਰੀਆਂ ਫਸਲਾਂ ਲਈ ਉਪਯੁਕਤ' : 
                   'Most fertile soil, suitable for all crops',
      image: '🌱',
      color: 'bg-green-100 border-green-300'
    },
    {
      id: 'sandy',
      name: 'Sandy Soil',
      nameNative: language === 'hi' ? 'बलुई मिट्टी' : language === 'pa' ? 'ਰੇਤਲੀ ਮਿੱਟੀ' : 'Sandy Soil',
      description: language === 'hi' ? 'पानी जल्दी निकल जाता है' : 
                   language === 'pa' ? 'ਪਾਣੀ ਜਲਦੀ ਨਿਕਲ ਜਾਂਦਾ ਹੈ' : 
                   'Water drains quickly',
      image: '🏖️',
      color: 'bg-yellow-100 border-yellow-300'
    },
    {
      id: 'clay',
      name: 'Clay Soil',
      nameNative: language === 'hi' ? 'चिकनी मिट्टी' : language === 'pa' ? 'ਚਿਕਨੀ ਮਿੱਟੀ' : 'Clay Soil',
      description: language === 'hi' ? 'पानी को रोकने वाली मिट्टी' : 
                   language === 'pa' ? 'ਪਾਣੀ ਨੂੰ ਰੋਕਣ ਵਾਲੀ ਮਿੱਟੀ' : 
                   'Water-retaining soil',
      image: '🏺',
      color: 'bg-purple-100 border-purple-300'
    }
  ];

  const crops: Crop[] = [
    {
      id: 'wheat',
      name: 'Wheat',
      nameNative: language === 'hi' ? 'गेहूं' : language === 'pa' ? 'ਕਣਕ' : 'Wheat',
      season: language === 'hi' ? 'रबी' : language === 'pa' ? 'ਰਬੀ' : 'Rabi',
      duration: language === 'hi' ? '120-150 दिन' : language === 'pa' ? '120-150 ਦਿਨ' : '120-150 days',
      yield: language === 'hi' ? '40-50 क्विंटल/हेक्टेयर' : language === 'pa' ? '40-50 ਕੁਇੰਟਲ/ਹੈਕਟੇਅਰ' : '40-50 quintals/hectare',
      price: '₹2,100/quintal',
      suitability: 95,
      description: language === 'hi' ? 'भारत की मुख्य रबी फसल, पोषक तत्वों से भरपूर' : 
                   language === 'pa' ? 'ਭਾਰਤ ਦੀ ਮੁੱਖ ਰਬੀ ਫਸਲ, ਪੋਸ਼ਕ ਤੱਤਾਂ ਨਾਲ ਭਰਪੂਰ' : 
                   'Main rabi crop of India, rich in nutrients',
      requirements: [
        language === 'hi' ? 'ठंडा मौसम' : language === 'pa' ? 'ਠੰਡਾ ਮੌਸਮ' : 'Cool weather',
        language === 'hi' ? 'अच्छी जल निकासी' : language === 'pa' ? 'ਚੰਗੀ ਜਲ ਨਿਕਾਸੀ' : 'Good drainage',
        language === 'hi' ? 'उर्वरक की आवश्यकता' : language === 'pa' ? 'ਖਾਦ ਦੀ ਲੋੜ' : 'Fertilizer requirement'
      ],
      benefits: [
        language === 'hi' ? 'उच्च पैदावार' : language === 'pa' ? 'ਉੱਚ ਪੈਦਾਵਾਰ' : 'High yield',
        language === 'hi' ? 'अच्छा बाजार भाव' : language === 'pa' ? 'ਚੰਗਾ ਬਾਜ਼ਾਰ ਭਾਅ' : 'Good market price',
        language === 'hi' ? 'कम जोखिम' : language === 'pa' ? 'ਕਮ ਜੋਖਿਮ' : 'Low risk'
      ],
      image: '🌾'
    },
    {
      id: 'rice',
      name: 'Rice',
      nameNative: language === 'hi' ? 'चावल' : language === 'pa' ? 'ਚਾਵਲ' : 'Rice',
      season: language === 'hi' ? 'खरीफ' : language === 'pa' ? 'ਖਰੀਫ' : 'Kharif',
      duration: language === 'hi' ? '90-120 दिन' : language === 'pa' ? '90-120 ਦਿਨ' : '90-120 days',
      yield: language === 'hi' ? '30-40 क्विंटल/हेक्टेयर' : language === 'pa' ? '30-40 ਕੁਇੰਟਲ/ਹੈਕਟੇਅਰ' : '30-40 quintals/hectare',
      price: '₹3,200/quintal',
      suitability: 88,
      description: language === 'hi' ? 'भारत की मुख्य खाद्य फसल, पानी की अधिक आवश्यकता' : 
                   language === 'pa' ? 'ਭਾਰਤ ਦੀ ਮੁੱਖ ਖਾਦਯ ਫਸਲ, ਪਾਣੀ ਦੀ ਵਧੇਰੇ ਲੋੜ' : 
                   'Main food crop of India, requires more water',
      requirements: [
        language === 'hi' ? 'गर्म और नम मौसम' : language === 'pa' ? 'ਗਰਮ ਅਤੇ ਨਮ ਮੌਸਮ' : 'Warm and humid weather',
        language === 'hi' ? 'पानी की अधिक आवश्यकता' : language === 'pa' ? 'ਪਾਣੀ ਦੀ ਵਧੇਰੇ ਲੋੜ' : 'High water requirement',
        language === 'hi' ? 'उपजाऊ मिट्टी' : language === 'pa' ? 'ਉਪਜਾਊ ਮਿੱਟੀ' : 'Fertile soil'
      ],
      benefits: [
        language === 'hi' ? 'उच्च पोषण मूल्य' : language === 'pa' ? 'ਉੱਚ ਪੋਸ਼ਣ ਮੁੱਲ' : 'High nutritional value',
        language === 'hi' ? 'स्थिर मांग' : language === 'pa' ? 'ਸਥਿਰ ਮੰਗ' : 'Stable demand',
        language === 'hi' ? 'निर्यात की संभावना' : language === 'pa' ? 'ਨਿਰਯਾਤ ਦੀ ਸੰਭਾਵਨਾ' : 'Export potential'
      ],
      image: '🍚'
    },
    {
      id: 'mustard',
      name: 'Mustard',
      nameNative: language === 'hi' ? 'सरसों' : language === 'pa' ? 'ਸਰੋਂ' : 'Mustard',
      season: language === 'hi' ? 'रबी' : language === 'pa' ? 'ਰਬੀ' : 'Rabi',
      duration: language === 'hi' ? '100-120 दिन' : language === 'pa' ? '100-120 ਦਿਨ' : '100-120 days',
      yield: language === 'hi' ? '15-20 क्विंटल/हेक्टेयर' : language === 'pa' ? '15-20 ਕੁਇੰਟਲ/ਹੈਕਟੇਅਰ' : '15-20 quintals/hectare',
      price: '₹5,500/quintal',
      suitability: 92,
      description: language === 'hi' ? 'तेल की फसल, कम पानी में उगाई जा सकती है' : 
                   language === 'pa' ? 'ਤੇਲ ਦੀ ਫਸਲ, ਕਮ ਪਾਣੀ ਵਿੱਚ ਉਗਾਈ ਜਾ ਸਕਦੀ ਹੈ' : 
                   'Oil crop, can be grown with less water',
      requirements: [
        language === 'hi' ? 'ठंडा मौसम' : language === 'pa' ? 'ਠੰਡਾ ਮੌਸਮ' : 'Cool weather',
        language === 'hi' ? 'कम पानी की आवश्यकता' : language === 'pa' ? 'ਕਮ ਪਾਣੀ ਦੀ ਲੋੜ' : 'Low water requirement',
        language === 'hi' ? 'अच्छी जल निकासी' : language === 'pa' ? 'ਚੰਗੀ ਜਲ ਨਿਕਾਸੀ' : 'Good drainage'
      ],
      benefits: [
        language === 'hi' ? 'उच्च मूल्य' : language === 'pa' ? 'ਉੱਚ ਮੁੱਲ' : 'High value',
        language === 'hi' ? 'कम लागत' : language === 'pa' ? 'ਕਮ ਲਾਗਤ' : 'Low cost',
        language === 'hi' ? 'तेल उत्पादन' : language === 'pa' ? 'ਤੇਲ ਉਤਪਾਦਨ' : 'Oil production'
      ],
      image: '🌿'
    }
  ];

  const steps = [
    { id: 1, title: language === 'hi' ? 'स्थान' : language === 'pa' ? 'ਸਥਾਨ' : 'Location' },
    { id: 2, title: language === 'hi' ? 'मिट्टी' : language === 'pa' ? 'ਮਿੱਟੀ' : 'Soil' },
    { id: 3, title: language === 'hi' ? 'मौसम' : language === 'pa' ? 'ਮੌਸਮ' : 'Season' },
    { id: 4, title: language === 'hi' ? 'विश्लेषण' : language === 'pa' ? 'ਵਿਸ਼ਲੇਸ਼ਣ' : 'Analysis' }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      generateRecommendations();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const generateRecommendations = () => {
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      const filteredCrops = crops.filter(crop => {
        if (formData.soilType === 'alluvial' || formData.soilType === 'loamy') {
          return crop.suitability > 85;
        } else if (formData.soilType === 'black') {
          return crop.id === 'wheat' || crop.id === 'mustard';
        } else {
          return crop.suitability > 80;
        }
      });
      
      setRecommendations(filteredCrops);
      setIsAnalyzing(false);
    }, 3000);
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
  return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-poppins font-bold text-forest-500 mb-2">
                {language === 'hi' ? 'अपना स्थान दर्ज करें' :
                 language === 'pa' ? 'ਆਪਣਾ ਸਥਾਨ ਦਰਜ ਕਰੋ' :
                 'Enter Your Location'}
              </h2>
              <p className="text-muted-foreground font-inter">
                {language === 'hi' ? 'सटीक सुझाव के लिए स्थान की जानकारी आवश्यक है' :
                 language === 'pa' ? 'ਸਹੀ ਸੁਝਾਅ ਲਈ ਸਥਾਨ ਦੀ ਜਾਣਕਾਰੀ ਜ਼ਰੂਰੀ ਹੈ' :
                 'Location information is required for accurate recommendations'}
              </p>
      </div>

            <div className="space-y-4">
          <div className="space-y-2">
                <Label htmlFor="location" className="font-inter font-medium">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  {language === 'hi' ? 'गांव/शहर का नाम' :
                   language === 'pa' ? 'ਪਿੰਡ/ਸ਼ਹਿਰ ਦਾ ਨਾਮ' :
                   'Village/City Name'}
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder={language === 'hi' ? 'जैसे: कानपुर, उत्तर प्रदेश' :
                             language === 'pa' ? 'ਜਿਵੇਂ: ਕਾਨਪੁਰ, ਉੱਤਰ ਪ੍ਰਦੇਸ਼' :
                             'e.g.: Kanpur, Uttar Pradesh'}
                  className="h-12 text-lg font-inter"
            />
          </div>

          <div className="space-y-2">
                <Label htmlFor="area" className="font-inter font-medium">
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  {language === 'hi' ? 'खेती का क्षेत्रफल (एकड़)' :
                   language === 'pa' ? 'ਖੇਤੀ ਦਾ ਖੇਤਰਫਲ (ਏਕੜ)' :
                   'Farming Area (acres)'}
                </Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  placeholder={language === 'hi' ? 'जैसे: 5 एकड़' :
                             language === 'pa' ? 'ਜਿਵੇਂ: 5 ਏਕੜ' :
                             'e.g.: 5 acres'}
                  className="h-12 text-lg font-inter"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-poppins font-bold text-forest-500 mb-2">
                {language === 'hi' ? 'मिट्टी का प्रकार चुनें' :
                 language === 'pa' ? 'ਮਿੱਟੀ ਦਾ ਪ੍ਰਕਾਰ ਚੁਣੋ' :
                 'Select Soil Type'}
              </h2>
              <p className="text-muted-foreground font-inter">
                {language === 'hi' ? 'अपनी जमीन की मिट्टी के अनुसार फसल चुनें' :
                 language === 'pa' ? 'ਆਪਣੀ ਜ਼ਮੀਨ ਦੀ ਮਿੱਟੀ ਦੇ ਅਨੁਸਾਰ ਫਸਲ ਚੁਣੋ' :
                 'Choose crops according to your land\'s soil'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {soilTypes.map((soil) => (
                <Card
                  key={soil.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-medium ${
                    formData.soilType === soil.id ? 'ring-2 ring-forest-500 bg-forest-50' : soil.color
                  }`}
                  onClick={() => setFormData({...formData, soilType: soil.id})}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-3xl">{soil.image}</div>
                      <div>
                        <h3 className="font-poppins font-semibold text-lg">{soil.nameNative}</h3>
                        <p className="text-sm text-muted-foreground font-inter">{soil.name}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground font-inter">{soil.description}</p>
                    {formData.soilType === soil.id && (
                      <div className="mt-3 flex items-center gap-2 text-forest-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-inter font-medium">
                          {language === 'hi' ? 'चयनित' : language === 'pa' ? 'ਚੁਣਿਆ' : 'Selected'}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-poppins font-bold text-forest-500 mb-2">
                {language === 'hi' ? 'मौसम और स्थिति' :
                 language === 'pa' ? 'ਮੌਸਮ ਅਤੇ ਸਥਿਤੀ' :
                 'Weather & Conditions'}
              </h2>
              <p className="text-muted-foreground font-inter">
                {language === 'hi' ? 'अपनी कृषि स्थिति के बारे में जानकारी दें' :
                 language === 'pa' ? 'ਆਪਣੀ ਖੇਤੀ ਸਥਿਤੀ ਬਾਰੇ ਜਾਣਕਾਰੀ ਦਿਓ' :
                 'Provide information about your farming conditions'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-inter font-medium">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  {language === 'hi' ? 'फसल का मौसम' :
                   language === 'pa' ? 'ਫਸਲ ਦਾ ਮੌਸਮ' :
                   'Crop Season'}
            </Label>
                <Select value={formData.season} onValueChange={(value) => setFormData({...formData, season: value})}>
                  <SelectTrigger className="h-12 font-inter">
                    <SelectValue placeholder={language === 'hi' ? 'मौसम चुनें' : language === 'pa' ? 'ਮੌਸਮ ਚੁਣੋ' : 'Select Season'} />
              </SelectTrigger>
              <SelectContent>
                    <SelectItem value="kharif">
                      {language === 'hi' ? 'खरीफ (जून-अक्टूबर)' : language === 'pa' ? 'ਖਰੀਫ (ਜੂਨ-ਅਕਤੂਬਰ)' : 'Kharif (June-October)'}
                    </SelectItem>
                    <SelectItem value="rabi">
                      {language === 'hi' ? 'रबी (अक्टूबर-मार्च)' : language === 'pa' ? 'ਰਬੀ (ਅਕਤੂਬਰ-ਮਾਰਚ)' : 'Rabi (October-March)'}
                    </SelectItem>
                    <SelectItem value="zaid">
                      {language === 'hi' ? 'जायद (मार्च-जून)' : language === 'pa' ? 'ਜ਼ੈਦ (ਮਾਰਚ-ਜੂਨ)' : 'Zaid (March-June)'}
                    </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
                <Label className="font-inter font-medium">
                  <Droplets className="w-4 h-4 inline mr-2" />
                  {language === 'hi' ? 'सिंचाई की सुविधा' :
                   language === 'pa' ? 'ਸਿੰਚਾਈ ਦੀ ਸੁਵਿਧਾ' :
                   'Irrigation Facility'}
            </Label>
                <Select value={formData.irrigation} onValueChange={(value) => setFormData({...formData, irrigation: value})}>
                  <SelectTrigger className="h-12 font-inter">
                    <SelectValue placeholder={language === 'hi' ? 'सिंचाई चुनें' : language === 'pa' ? 'ਸਿੰਚਾਈ ਚੁਣੋ' : 'Select Irrigation'} />
              </SelectTrigger>
              <SelectContent>
                    <SelectItem value="good">
                      {language === 'hi' ? 'अच्छी सिंचाई' : language === 'pa' ? 'ਚੰਗੀ ਸਿੰਚਾਈ' : 'Good Irrigation'}
                    </SelectItem>
                    <SelectItem value="moderate">
                      {language === 'hi' ? 'मध्यम सिंचाई' : language === 'pa' ? 'ਮੱਧਮ ਸਿੰਚਾਈ' : 'Moderate Irrigation'}
                    </SelectItem>
                    <SelectItem value="limited">
                      {language === 'hi' ? 'सीमित सिंचाई' : language === 'pa' ? 'ਸੀਮਿਤ ਸਿੰਚਾਈ' : 'Limited Irrigation'}
                    </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
                <Label className="font-inter font-medium">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  {language === 'hi' ? 'बजट (प्रति एकड़)' :
                   language === 'pa' ? 'ਬਜਟ (ਪ੍ਰਤੀ ਏਕੜ)' :
                   'Budget (per acre)'}
            </Label>
                <Select value={formData.budget} onValueChange={(value) => setFormData({...formData, budget: value})}>
                  <SelectTrigger className="h-12 font-inter">
                    <SelectValue placeholder={language === 'hi' ? 'बजट चुनें' : language === 'pa' ? 'ਬਜਟ ਚੁਣੋ' : 'Select Budget'} />
              </SelectTrigger>
              <SelectContent>
                    <SelectItem value="low">
                      {language === 'hi' ? 'कम बजट (< ₹20,000)' : language === 'pa' ? 'ਕਮ ਬਜਟ (< ₹20,000)' : 'Low Budget (< ₹20,000)'}
                    </SelectItem>
                    <SelectItem value="medium">
                      {language === 'hi' ? 'मध्यम बजट (₹20,000-₹50,000)' : language === 'pa' ? 'ਮੱਧਮ ਬਜਟ (₹20,000-₹50,000)' : 'Medium Budget (₹20,000-₹50,000)'}
                    </SelectItem>
                    <SelectItem value="high">
                      {language === 'hi' ? 'उच्च बजट (> ₹50,000)' : language === 'pa' ? 'ਉੱਚ ਬਜਟ (> ₹50,000)' : 'High Budget (> ₹50,000)'}
                    </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {isAnalyzing ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-forest-500 to-forest-600 rounded-full flex items-center justify-center animate-pulse">
                  <Sprout className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-poppins font-bold text-forest-500 mb-2">
                  {language === 'hi' ? 'विश्लेषण कर रहे हैं...' :
                   language === 'pa' ? 'ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਹੇ ਹਾਂ...' :
                   'Analyzing...'}
                </h2>
                <p className="text-muted-foreground font-inter mb-4">
                  {language === 'hi' ? 'आपकी जानकारी के आधार पर सर्वोत्तम फसलों का चयन कर रहे हैं' :
                   language === 'pa' ? 'ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ \'ਤੇ ਸਰਵੋਤਮ ਫਸਲਾਂ ਦਾ ਚਯਨ ਕਰ ਰਹੇ ਹਾਂ' :
                   'Selecting the best crops based on your information'}
                </p>
                <Progress value={75} className="w-full max-w-md mx-auto" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-poppins font-bold text-forest-500 mb-2">
                    {language === 'hi' ? 'फसल सुझाव' :
                     language === 'pa' ? 'ਫਸਲ ਸੁਝਾਅ' :
                     'Crop Recommendations'}
                  </h2>
                  <p className="text-muted-foreground font-inter">
                    {language === 'hi' ? 'आपकी जानकारी के आधार पर सर्वोत्तम फसलें' :
                     language === 'pa' ? 'ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ \'ਤੇ ਸਰਵੋਤਮ ਫਸਲਾਂ' :
                     'Best crops based on your information'}
                  </p>
        </div>

                <div className="space-y-4">
                  {recommendations.map((crop, index) => (
                    <Card key={crop.id} className="border-0 shadow-medium bg-white/90 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="text-4xl">{crop.image}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-poppins font-bold text-forest-500">{crop.nameNative}</h3>
                              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                {crop.suitability}% {language === 'hi' ? 'उपयुक्त' : language === 'pa' ? 'ਉਪਯੁਕਤ' : 'Suitable'}
              </Badge>
            </div>

                            <p className="text-muted-foreground font-inter mb-4">{crop.description}</p>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                              <div className="text-center p-3 bg-sky-50 rounded-lg">
                                <Calendar className="w-5 h-5 mx-auto mb-1 text-sky-600" />
                                <div className="text-sm font-inter font-medium text-sky-700">{crop.season}</div>
                                <div className="text-xs text-sky-600">{language === 'hi' ? 'मौसम' : language === 'pa' ? 'ਮੌਸਮ' : 'Season'}</div>
                              </div>
                              <div className="text-center p-3 bg-harvest-50 rounded-lg">
                                <Clock className="w-5 h-5 mx-auto mb-1 text-harvest-600" />
                                <div className="text-sm font-inter font-medium text-harvest-700">{crop.duration}</div>
                                <div className="text-xs text-harvest-600">{language === 'hi' ? 'अवधि' : language === 'pa' ? 'ਅਵਧੀ' : 'Duration'}</div>
                </div>
                              <div className="text-center p-3 bg-forest-50 rounded-lg">
                                <TrendingUp className="w-5 h-5 mx-auto mb-1 text-forest-600" />
                                <div className="text-sm font-inter font-medium text-forest-700">{crop.yield}</div>
                                <div className="text-xs text-forest-600">{language === 'hi' ? 'पैदावार' : language === 'pa' ? 'ਪੈਦਾਵਾਰ' : 'Yield'}</div>
                </div>
                              <div className="text-center p-3 bg-soil-50 rounded-lg">
                                <DollarSign className="w-5 h-5 mx-auto mb-1 text-soil-600" />
                                <div className="text-sm font-inter font-medium text-soil-700">{crop.price}</div>
                                <div className="text-xs text-soil-600">{language === 'hi' ? 'भाव' : language === 'pa' ? 'ਭਾਅ' : 'Price'}</div>
              </div>
            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                                <h4 className="font-poppins font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
                                  <Info className="w-4 h-4 text-sky-600" />
                                  {language === 'hi' ? 'आवश्यकताएं' : language === 'pa' ? 'ਲੋੜਾਂ' : 'Requirements'}
                </h4>
                                <ul className="space-y-1">
                                  {crop.requirements.map((req, i) => (
                                    <li key={i} className="text-sm text-muted-foreground font-inter flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-sky-500 rounded-full" />
                                      {req}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                                <h4 className="font-poppins font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
                                  <Star className="w-4 h-4 text-harvest-600" />
                                  {language === 'hi' ? 'लाभ' : language === 'pa' ? 'ਲਾਭ' : 'Benefits'}
                </h4>
                                <ul className="space-y-1">
                                  {crop.benefits.map((benefit, i) => (
                                    <li key={i} className="text-sm text-muted-foreground font-inter flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-harvest-500 rounded-full" />
                                      {benefit}
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
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-background to-forest-50">
      {/* Header */}
      <div className="bg-gradient-field text-white p-4 shadow-medium">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'hi' ? 'वापस' : language === 'pa' ? 'ਵਾਪਸ' : 'Back'}
            </Button>
            <div>
              <h1 className="text-lg font-poppins font-bold">
                {language === 'hi' ? 'फसल सुझाव' : language === 'pa' ? 'ਫਸਲ ਸੁਝਾਅ' : 'Crop Recommendation'}
              </h1>
              <p className="text-sm opacity-90 font-inter">
                {language === 'hi' ? 'स्मार्ट फसल चयन' : language === 'pa' ? 'ਸਮਾਰਟ ਫਸਲ ਚਯਨ' : 'Smart Crop Selection'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-inter opacity-90">
              {language === 'hi' ? 'चरण' : language === 'pa' ? 'ਕਦਮ' : 'Step'} {currentStep}/4
            </div>
            <Progress value={(currentStep / 4) * 100} className="w-24 mt-1" />
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-forest-100 p-4">
        <div className="flex justify-between max-w-4xl mx-auto">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-poppins font-semibold ${
                currentStep >= step.id 
                  ? 'bg-gradient-field text-white' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {step.id}
              </div>
              <span className={`text-sm font-inter ${
                currentStep >= step.id ? 'text-forest-600 font-medium' : 'text-muted-foreground'
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-medium bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              {getStepContent()}
            </CardContent>
        </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              className="font-inter"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentStep === 1 ? 
                (language === 'hi' ? 'वापस जाएं' : language === 'pa' ? 'ਵਾਪਸ ਜਾਓ' : 'Go Back') :
                (language === 'hi' ? 'पिछला' : language === 'pa' ? 'ਪਿਛਲਾ' : 'Previous')
              }
            </Button>
            
            {currentStep < 4 && (
              <Button
                onClick={handleNext}
                disabled={!formData.location || !formData.soilType || !formData.season}
                className="bg-gradient-field text-white hover:shadow-medium font-inter"
              >
                {language === 'hi' ? 'अगला' : language === 'pa' ? 'ਅਗਲਾ' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
            
            {currentStep === 4 && !isAnalyzing && (
              <Button
                onClick={() => setCurrentStep(1)}
                className="bg-gradient-field text-white hover:shadow-medium font-inter"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {language === 'hi' ? 'फिर से शुरू करें' : language === 'pa' ? 'ਫਿਰ ਸ਼ੁਰੂ ਕਰੋ' : 'Start Again'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropRecommendation;