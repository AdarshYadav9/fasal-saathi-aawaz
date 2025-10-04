import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Brain, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Calendar,
  MapPin,
  Droplets,
  Sun,
  Loader2
} from 'lucide-react'

interface CropRecommendation {
  id: string
  name: string
  nameHindi: string
  namePunjabi: string
  season: string
  seasonHindi: string
  seasonPunjabi: string
  confidence: number
  suitability: 'excellent' | 'good' | 'moderate' | 'poor'
  yield: string
  yieldHindi: string
  yieldPunjabi: string
  plantingTime: string
  plantingTimeHindi: string
  plantingTimePunjabi: string
  waterRequirement: 'low' | 'medium' | 'high'
  soilType: string
  soilTypeHindi: string
  soilTypePunjabi: string
  marketPrice: number
  priceUnit: string
  benefits: string[]
  benefitsHindi: string[]
  benefitsPunjabi: string[]
}

interface SoilAnalysis {
  soilType: string
  ph: number
  moisture: number
  organicMatter: number
  nutrients: {
    nitrogen: number
    phosphorus: number
    potassium: number
  }
  location: string
  season: string
}

interface AIPredictionProps {
  soilAnalysis: SoilAnalysis
  language: string
  onSaveRecommendation?: (recommendation: CropRecommendation) => void
}

export const AIPrediction: React.FC<AIPredictionProps> = ({ 
  soilAnalysis, 
  language, 
  onSaveRecommendation 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [progress, setProgress] = useState(0)
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([])
  const [error, setError] = useState<string | null>(null)

  const translations = {
    en: {
      title: 'AI Crop Recommendations',
      subtitle: 'Based on your soil analysis and location',
      analyzing: 'Analyzing soil data...',
      analysisComplete: 'Analysis Complete',
      topRecommendations: 'Top Recommendations',
      viewAll: 'View All Recommendations',
      saveRecommendation: 'Save Recommendation',
      saved: 'Saved',
      suitability: 'Suitability',
      yield: 'Expected Yield',
      plantingTime: 'Planting Time',
      waterRequirement: 'Water Requirement',
      soilType: 'Soil Type',
      marketPrice: 'Market Price',
      benefits: 'Benefits',
      excellent: 'Excellent',
      good: 'Good',
      moderate: 'Moderate',
      poor: 'Poor',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      perKg: 'per kg',
      perQuintal: 'per quintal',
      error: 'Failed to analyze soil data. Please try again.',
      retry: 'Retry Analysis'
    },
    hi: {
      title: 'AI फसल सिफारिशें',
      subtitle: 'आपके मिट्टी विश्लेषण और स्थान के आधार पर',
      analyzing: 'मिट्टी डेटा का विश्लेषण...',
      analysisComplete: 'विश्लेषण पूरा',
      topRecommendations: 'शीर्ष सिफारिशें',
      viewAll: 'सभी सिफारिशें देखें',
      saveRecommendation: 'सिफारिश सहेजें',
      saved: 'सहेजा गया',
      suitability: 'उपयुक्तता',
      yield: 'अपेक्षित उपज',
      plantingTime: 'बुवाई का समय',
      waterRequirement: 'पानी की आवश्यकता',
      soilType: 'मिट्टी का प्रकार',
      marketPrice: 'बाजार भाव',
      benefits: 'फायदे',
      excellent: 'उत्कृष्ट',
      good: 'अच्छा',
      moderate: 'मध्यम',
      poor: 'खराब',
      low: 'कम',
      medium: 'मध्यम',
      high: 'अधिक',
      perKg: 'प्रति किलो',
      perQuintal: 'प्रति क्विंटल',
      error: 'मिट्टी डेटा का विश्लेषण करने में विफल। कृपया पुनः प्रयास करें।',
      retry: 'विश्लेषण पुनः करें'
    },
    pa: {
      title: 'AI ਫਸਲ ਸਿਫਾਰਸ਼ਾਂ',
      subtitle: 'ਤੁਹਾਡੇ ਮਿੱਟੀ ਦੇ ਵਿਸ਼ਲੇਸ਼ਣ ਅਤੇ ਸਥਾਨ ਦੇ ਆਧਾਰ \'ਤੇ',
      analyzing: 'ਮਿੱਟੀ ਡੇਟਾ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ...',
      analysisComplete: 'ਵਿਸ਼ਲੇਸ਼ਣ ਪੂਰਾ',
      topRecommendations: 'ਚੋਟੀ ਦੀਆਂ ਸਿਫਾਰਸ਼ਾਂ',
      viewAll: 'ਸਾਰੀਆਂ ਸਿਫਾਰਸ਼ਾਂ ਦੇਖੋ',
      saveRecommendation: 'ਸਿਫਾਰਸ਼ ਸੇਵ ਕਰੋ',
      saved: 'ਸੇਵ ਕੀਤਾ ਗਿਆ',
      suitability: 'ਉਪਯੁਕਤਾ',
      yield: 'ਅਪੇਕਸ਼ਿਤ ਉਪਜ',
      plantingTime: 'ਬੀਜਾਈ ਦਾ ਸਮਾਂ',
      waterRequirement: 'ਪਾਣੀ ਦੀ ਲੋੜ',
      soilType: 'ਮਿੱਟੀ ਦਾ ਪ੍ਰਕਾਰ',
      marketPrice: 'ਬਾਜ਼ਾਰ ਭਾਅ',
      benefits: 'ਫਾਇਦੇ',
      excellent: 'ਉੱਤਮ',
      good: 'ਚੰਗਾ',
      moderate: 'ਦਰਮਿਆਨਾ',
      poor: 'ਖਰਾਬ',
      low: 'ਘੱਟ',
      medium: 'ਦਰਮਿਆਨਾ',
      high: 'ਵੱਧ',
      perKg: 'ਪ੍ਰਤੀ ਕਿਲੋ',
      perQuintal: 'ਪ੍ਰਤੀ ਕੁਇੰਟਲ',
      error: 'ਮਿੱਟੀ ਡੇਟਾ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰਨ ਵਿੱਚ ਅਸਫਲ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
      retry: 'ਵਿਸ਼ਲੇਸ਼ਣ ਦੁਬਾਰਾ ਕਰੋ'
    }
  }

  const t = translations[language as keyof typeof translations] || translations.en

  // Mock AI analysis function
  const analyzeSoil = async (soilData: SoilAnalysis): Promise<CropRecommendation[]> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Mock recommendations based on soil data
    const mockRecommendations: CropRecommendation[] = [
      {
        id: '1',
        name: 'Wheat',
        nameHindi: 'गेहूं',
        namePunjabi: 'ਕਣਕ',
        season: 'Rabi',
        seasonHindi: 'रबी',
        seasonPunjabi: 'ਰਬੀ',
        confidence: 92,
        suitability: 'excellent',
        yield: '45-50 quintals/hectare',
        yieldHindi: '45-50 क्विंटल/हेक्टेयर',
        yieldPunjabi: '45-50 ਕੁਇੰਟਲ/ਹੈਕਟੇਅਰ',
        plantingTime: 'October-November',
        plantingTimeHindi: 'अक्टूबर-नवंबर',
        plantingTimePunjabi: 'ਅਕਤੂਬਰ-ਨਵੰਬਰ',
        waterRequirement: 'medium',
        soilType: 'Clay Loam',
        soilTypeHindi: 'चिकनी दोमट',
        soilTypePunjabi: 'ਮਿੱਟੀ ਦੋਮਟ',
        marketPrice: 2200,
        priceUnit: t.perQuintal,
        benefits: [
          'High nutritional value',
          'Good market demand',
          'Suitable for your soil type',
          'Drought resistant varieties available'
        ],
        benefitsHindi: [
          'उच्च पोषण मूल्य',
          'अच्छी बाजार मांग',
          'आपकी मिट्टी के प्रकार के लिए उपयुक्त',
          'सूखा प्रतिरोधी किस्में उपलब्ध'
        ],
        benefitsPunjabi: [
          'ਉੱਚ ਪੋਸ਼ਣ ਮੁੱਲ',
          'ਚੰਗੀ ਬਾਜ਼ਾਰ ਮੰਗ',
          'ਤੁਹਾਡੀ ਮਿੱਟੀ ਦੇ ਪ੍ਰਕਾਰ ਲਈ ਉਪਯੁਕਤ',
          'ਸੁੱਕਾ ਪ੍ਰਤੀਰੋਧੀ ਕਿਸਮਾਂ ਉਪਲਬਧ'
        ]
      },
      {
        id: '2',
        name: 'Rice',
        nameHindi: 'चावल',
        namePunjabi: 'ਚਾਵਲ',
        season: 'Kharif',
        seasonHindi: 'खरीफ',
        seasonPunjabi: 'ਖਰੀਫ',
        confidence: 88,
        suitability: 'good',
        yield: '35-40 quintals/hectare',
        yieldHindi: '35-40 क्विंटल/हेक्टेयर',
        yieldPunjabi: '35-40 ਕੁਇੰਟਲ/ਹੈਕਟੇਅਰ',
        plantingTime: 'June-July',
        plantingTimeHindi: 'जून-जुलाई',
        plantingTimePunjabi: 'ਜੂਨ-ਜੁਲਾਈ',
        waterRequirement: 'high',
        soilType: 'Clay Loam',
        soilTypeHindi: 'चिकनी दोमट',
        soilTypePunjabi: 'ਮਿੱਟੀ ਦੋਮਟ',
        marketPrice: 1800,
        priceUnit: t.perQuintal,
        benefits: [
          'Staple food crop',
          'High water retention soil suitable',
          'Good market price',
          'Multiple varieties available'
        ],
        benefitsHindi: [
          'मुख्य खाद्य फसल',
          'उच्च जल धारण क्षमता वाली मिट्टी उपयुक्त',
          'अच्छी बाजार कीमत',
          'कई किस्में उपलब्ध'
        ],
        benefitsPunjabi: [
          'ਮੁੱਖ ਭੋਜਨ ਫਸਲ',
          'ਉੱਚ ਪਾਣੀ ਧਾਰਨ ਸਮਰੱਥਾ ਵਾਲੀ ਮਿੱਟੀ ਉਪਯੁਕਤ',
          'ਚੰਗੀ ਬਾਜ਼ਾਰ ਕੀਮਤ',
          'ਕਈ ਕਿਸਮਾਂ ਉਪਲਬਧ'
        ]
      },
      {
        id: '3',
        name: 'Mustard',
        nameHindi: 'सरसों',
        namePunjabi: 'ਸਰੋਂ',
        season: 'Rabi',
        seasonHindi: 'रबी',
        seasonPunjabi: 'ਰਬੀ',
        confidence: 85,
        suitability: 'good',
        yield: '15-20 quintals/hectare',
        yieldHindi: '15-20 क्विंटल/हेक्टेयर',
        yieldPunjabi: '15-20 ਕੁਇੰਟਲ/ਹੈਕਟੇਅਰ',
        plantingTime: 'October-November',
        plantingTimeHindi: 'अक्टूबर-नवंबर',
        plantingTimePunjabi: 'ਅਕਤੂਬਰ-ਨਵੰਬਰ',
        waterRequirement: 'low',
        soilType: 'Clay Loam',
        soilTypeHindi: 'चिकनी दोमट',
        soilTypePunjabi: 'ਮਿੱਟੀ ਦੋਮਟ',
        marketPrice: 4500,
        priceUnit: t.perQuintal,
        benefits: [
          'Oilseed crop with high value',
          'Low water requirement',
          'Good for crop rotation',
          'High market demand'
        ],
        benefitsHindi: [
          'उच्च मूल्य वाली तिलहन फसल',
          'कम पानी की आवश्यकता',
          'फसल चक्र के लिए अच्छी',
          'उच्च बाजार मांग'
        ],
        benefitsPunjabi: [
          'ਉੱਚ ਮੁੱਲ ਵਾਲੀ ਤਿਲਹਨ ਫਸਲ',
          'ਘੱਟ ਪਾਣੀ ਦੀ ਲੋੜ',
          'ਫਸਲ ਚੱਕਰ ਲਈ ਚੰਗੀ',
          'ਉੱਚ ਬਾਜ਼ਾਰ ਮੰਗ'
        ]
      }
    ]

    return mockRecommendations
  }

  useEffect(() => {
    const runAnalysis = async () => {
      try {
        setIsAnalyzing(true)
        setError(null)
        
        // Simulate progress
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return 90
            }
            return prev + 10
          })
        }, 300)

        const results = await analyzeSoil(soilAnalysis)
        
        clearInterval(progressInterval)
        setProgress(100)
        setRecommendations(results)
        setIsAnalyzing(false)
      } catch (err) {
        setError(t.error)
        setIsAnalyzing(false)
      }
    }

    runAnalysis()
  }, [soilAnalysis, t.error])

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case 'excellent': return 'bg-green-100 text-green-800'
      case 'good': return 'bg-blue-100 text-blue-800'
      case 'moderate': return 'bg-yellow-100 text-yellow-800'
      case 'poor': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getWaterRequirementIcon = (requirement: string) => {
    switch (requirement) {
      case 'low': return <Droplets className="w-4 h-4 text-blue-500" />
      case 'medium': return <Droplets className="w-4 h-4 text-blue-600" />
      case 'high': return <Droplets className="w-4 h-4 text-blue-700" />
      default: return <Droplets className="w-4 h-4 text-gray-500" />
    }
  }

  const handleSaveRecommendation = (recommendation: CropRecommendation) => {
    if (onSaveRecommendation) {
      onSaveRecommendation(recommendation)
    }
  }

  if (isAnalyzing) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Brain className="w-12 h-12 text-primary animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">{t.analyzing}</h3>
              <Progress value={progress} className="w-full max-w-xs mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="w-4 h-4" />
        <AlertDescription className="flex items-center justify-between">
          {error}
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            {t.retry}
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            {t.analysisComplete}
          </CardTitle>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t.topRecommendations}</h3>
        
        {recommendations.map((crop, index) => (
          <Card key={crop.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold">
                      {language === 'hi' ? crop.nameHindi : 
                       language === 'pa' ? crop.namePunjabi : 
                       crop.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {language === 'hi' ? crop.seasonHindi : 
                       language === 'pa' ? crop.seasonPunjabi : 
                       crop.season} Season
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getSuitabilityColor(crop.suitability)}>
                      {t[crop.suitability as keyof typeof t] || crop.suitability}
                    </Badge>
                    <Badge variant="outline">
                      {crop.confidence}% {t.confidence}
                    </Badge>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">{t.yield}</p>
                      <p className="font-medium">
                        {language === 'hi' ? crop.yieldHindi : 
                         language === 'pa' ? crop.yieldPunjabi : 
                         crop.yield}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">{t.plantingTime}</p>
                      <p className="font-medium">
                        {language === 'hi' ? crop.plantingTimeHindi : 
                         language === 'pa' ? crop.plantingTimePunjabi : 
                         crop.plantingTime}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getWaterRequirementIcon(crop.waterRequirement)}
                    <div>
                      <p className="text-muted-foreground">{t.waterRequirement}</p>
                      <p className="font-medium capitalize">
                        {t[crop.waterRequirement as keyof typeof t] || crop.waterRequirement}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">{t.soilType}</p>
                      <p className="font-medium">
                        {language === 'hi' ? crop.soilTypeHindi : 
                         language === 'pa' ? crop.soilTypePunjabi : 
                         crop.soilType}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Market Price */}
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">{t.marketPrice}</p>
                    <p className="text-lg font-semibold">
                      ₹{crop.marketPrice} {crop.priceUnit}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSaveRecommendation(crop)}
                  >
                    {t.saveRecommendation}
                  </Button>
                </div>

                {/* Benefits */}
                <div>
                  <p className="text-sm font-medium mb-2">{t.benefits}:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {(language === 'hi' ? crop.benefitsHindi : 
                      language === 'pa' ? crop.benefitsPunjabi : 
                      crop.benefits).map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
