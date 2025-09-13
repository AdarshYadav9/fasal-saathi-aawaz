import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Search, MapPin, Calendar, RefreshCw } from 'lucide-react';

interface MarketPricesProps {
  language: string;
}

interface PriceData {
  crop: string;
  market: string;
  currentPrice: number;
  previousPrice: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  quality: string;
  lastUpdated: Date;
}

export const MarketPrices = ({ language }: MarketPricesProps) => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [filteredData, setFilteredData] = useState<PriceData[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<string>('');
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const translations = {
    en: {
      title: 'Market Prices',
      subtitle: 'Live market prices for crops in your region',
      searchPlaceholder: 'Search crops...',
      selectMarket: 'Select Market',
      selectCrop: 'Select Crop',
      allMarkets: 'All Markets',
      allCrops: 'All Crops',
      currentPrice: 'Current Price',
      previousPrice: 'Previous Price',
      change: 'Change',
      quality: 'Quality',
      lastUpdated: 'Last Updated',
      refreshPrices: 'Refresh Prices',
      trending: 'Trending',
      unit: 'per quintal',
      noDataFound: 'No price data found for your search',
      syncOffline: 'Sync when online',
    },
    hi: {
      title: 'बाजार भाव',
      subtitle: 'आपके क्षेत्र में फसलों के लाइव बाजार भाव',
      searchPlaceholder: 'फसलें खोजें...',
      selectMarket: 'बाजार चुनें',
      selectCrop: 'फसल चुनें',
      allMarkets: 'सभी बाजार',
      allCrops: 'सभी फसलें',
      currentPrice: 'वर्तमान भाव',
      previousPrice: 'पिछला भाव',
      change: 'बदलाव',
      quality: 'गुणवत्ता',
      lastUpdated: 'अंतिम अपडेट',
      refreshPrices: 'भाव रिफ्रेश करें',
      trending: 'ट्रेंडिंग',
      unit: 'प्रति क्विंटल',
      noDataFound: 'आपकी खोज के लिए कोई भाव डेटा नहीं मिला',
      syncOffline: 'ऑनलाइन होने पर सिंक करें',
    },
    pa: {
      title: 'ਬਾਜ਼ਾਰ ਭਾਅ',
      subtitle: 'ਤੁਹਾਡੇ ਖੇਤਰ ਵਿੱਚ ਫਸਲਾਂ ਦੇ ਲਾਈਵ ਬਾਜ਼ਾਰ ਭਾਅ',
      searchPlaceholder: 'ਫਸਲਾਂ ਖੋਜੋ...',
      selectMarket: 'ਬਾਜ਼ਾਰ ਚੁਣੋ',
      selectCrop: 'ਫਸਲ ਚੁਣੋ',
      allMarkets: 'ਸਾਰੇ ਬਾਜ਼ਾਰ',
      allCrops: 'ਸਾਰੀਆਂ ਫਸਲਾਂ',
      currentPrice: 'ਮੌਜੂਦਾ ਭਾਅ',
      previousPrice: 'ਪਿਛਲਾ ਭਾਅ',
      change: 'ਤਬਦੀਲੀ',
      quality: 'ਗੁਣਵੱਤਾ',
      lastUpdated: 'ਆਖਰੀ ਅਪਡੇਟ',
      refreshPrices: 'ਭਾਅ ਰਿਫ੍ਰੈਸ਼ ਕਰੋ',
      trending: 'ਟ੍ਰੈਂਡਿੰਗ',
      unit: 'ਪ੍ਰਤੀ ਕੁਇੰਟਲ',
      noDataFound: 'ਤੁਹਾਡੀ ਖੋਜ ਲਈ ਕੋਈ ਭਾਅ ਡੇਟਾ ਨਹੀਂ ਮਿਲਿਆ',
      syncOffline: 'ਔਨਲਾਈਨ ਹੋਣ ਤੇ ਸਿੰਕ ਕਰੋ',
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  // Mock market data
  const mockMarketData: PriceData[] = [
    {
      crop: language === 'hi' ? 'गेहूं' : language === 'pa' ? 'ਕਣਕ' : 'Wheat',
      market: language === 'hi' ? 'दिल्ली' : language === 'pa' ? 'ਦਿੱਲੀ' : 'Delhi',
      currentPrice: 2150,
      previousPrice: 2100,
      unit: 'quintal',
      trend: 'up',
      change: 2.38,
      quality: language === 'hi' ? 'अच्छा' : language === 'pa' ? 'ਚੰਗੀ' : 'Good',
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      crop: language === 'hi' ? 'चावल' : language === 'pa' ? 'ਚਾਵਲ' : 'Rice',
      market: language === 'hi' ? 'पंजाब' : language === 'pa' ? 'ਪੰਜਾਬ' : 'Punjab',
      currentPrice: 3200,
      previousPrice: 3350,
      unit: 'quintal',
      trend: 'down',
      change: -4.48,
      quality: language === 'hi' ? 'उत्कृष्ट' : language === 'pa' ? 'ਸ਼ਾਨਦਾਰ' : 'Excellent',
      lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    },
    {
      crop: language === 'hi' ? 'मक्का' : language === 'pa' ? 'ਮੱਕੀ' : 'Maize',
      market: language === 'hi' ? 'हरियाणा' : language === 'pa' ? 'ਹਰਿਆਣਾ' : 'Haryana',
      currentPrice: 1850,
      previousPrice: 1850,
      unit: 'quintal',
      trend: 'stable',
      change: 0,
      quality: language === 'hi' ? 'अच्छा' : language === 'pa' ? 'ਚੰਗੀ' : 'Good',
      lastUpdated: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    },
    {
      crop: language === 'hi' ? 'सरसों' : language === 'pa' ? 'ਸਰੋਂ' : 'Mustard',
      market: language === 'hi' ? 'राजस्थान' : language === 'pa' ? 'ਰਾਜਸਥਾਨ' : 'Rajasthan',
      currentPrice: 5200,
      previousPrice: 4950,
      unit: 'quintal',
      trend: 'up',
      change: 5.05,
      quality: language === 'hi' ? 'उत्कृष्ट' : language === 'pa' ? 'ਸ਼ਾਨਦਾਰ' : 'Excellent',
      lastUpdated: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    },
    {
      crop: language === 'hi' ? 'प्याज़' : language === 'pa' ? 'ਪਿਆਜ਼' : 'Onion',
      market: language === 'hi' ? 'महाराष्ट्र' : language === 'pa' ? 'ਮਹਾਰਾਸ਼ਟਰ' : 'Maharashtra',
      currentPrice: 2800,
      previousPrice: 3100,
      unit: 'quintal',
      trend: 'down',
      change: -9.68,
      quality: language === 'hi' ? 'मध्यम' : language === 'pa' ? 'ਮੱਧਮ' : 'Medium',
      lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    },
    {
      crop: language === 'hi' ? 'आलू' : language === 'pa' ? 'ਆਲੂ' : 'Potato',
      market: language === 'hi' ? 'उत्तर प्रदेश' : language === 'pa' ? 'ਉੱਤਰ ਪ੍ਰਦੇਸ਼' : 'Uttar Pradesh',
      currentPrice: 1200,
      previousPrice: 1180,
      unit: 'quintal',
      trend: 'up',
      change: 1.69,
      quality: language === 'hi' ? 'अच्छा' : language === 'pa' ? 'ਚੰਗੀ' : 'Good',
      lastUpdated: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
    }
  ];

  useEffect(() => {
    // Simulate loading market data
    setIsLoading(true);
    setTimeout(() => {
      setPriceData(mockMarketData);
      setFilteredData(mockMarketData);
      setIsLoading(false);
    }, 1000);
  }, [language]);

  useEffect(() => {
    // Filter data based on search and selections
    let filtered = priceData;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.crop.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedMarket && selectedMarket !== 'all') {
      filtered = filtered.filter(item => item.market === selectedMarket);
    }

    if (selectedCrop && selectedCrop !== 'all') {
      filtered = filtered.filter(item => item.crop === selectedCrop);
    }

    setFilteredData(filtered);
  }, [searchTerm, selectedMarket, selectedCrop, priceData]);

  const refreshPrices = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update prices with small random changes
    const updatedData = mockMarketData.map(item => ({
      ...item,
      previousPrice: item.currentPrice,
      currentPrice: item.currentPrice + (Math.random() - 0.5) * 200,
      lastUpdated: new Date(),
    })).map(item => ({
      ...item,
      change: ((item.currentPrice - item.previousPrice) / item.previousPrice) * 100,
      trend: item.currentPrice > item.previousPrice ? 'up' as const : 
             item.currentPrice < item.previousPrice ? 'down' as const : 'stable' as const,
    }));

    setPriceData(updatedData);
    setIsLoading(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m ago`;
    }
    return `${diffMinutes}m ago`;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      default:
        return <div className="w-4 h-4 bg-muted rounded-full" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const uniqueMarkets = Array.from(new Set(priceData.map(item => item.market)));
  const uniqueCrops = Array.from(new Set(priceData.map(item => item.crop)));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
          📈 {t.title}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Filters */}
      <Card className="p-4 shadow-medium">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm sm:text-base"
            />
          </div>

          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger className="text-sm sm:text-base">
              <SelectValue placeholder={t.selectMarket} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-sm sm:text-base">{t.allMarkets}</SelectItem>
              {uniqueMarkets.map((market) => (
                <SelectItem key={market} value={market} className="text-sm sm:text-base">{market}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger className="text-sm sm:text-base">
              <SelectValue placeholder={t.selectCrop} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-sm sm:text-base">{t.allCrops}</SelectItem>
              {uniqueCrops.map((crop) => (
                <SelectItem key={crop} value={crop} className="text-sm sm:text-base">{crop}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="field"
            onClick={refreshPrices}
            disabled={isLoading}
            className="flex items-center gap-2 text-sm sm:text-base"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {t.refreshPrices}
          </Button>
        </div>
      </Card>

      {/* Price Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
            </Card>
          ))}
        </div>
      ) : filteredData.length === 0 ? (
        <Card className="p-6 text-center">
          <div className="text-3xl sm:text-4xl mb-4">📊</div>
          <p className="text-sm sm:text-base text-muted-foreground">{t.noDataFound}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map((item, index) => (
            <Card key={index} className="p-4 hover:shadow-medium transition-all duration-300">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base sm:text-lg text-primary">{item.crop}</h3>
                  {getTrendIcon(item.trend)}
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {item.market}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t.currentPrice}:</span>
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(item.currentPrice)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">{t.previousPrice}:</span>
                    <span>{formatPrice(item.previousPrice)}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span>{t.change}:</span>
                    <span className={`font-medium ${getTrendColor(item.trend)}`}>
                      {item.change > 0 ? '+' : ''}{item.change.toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {t.quality}: {item.quality}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatTime(item.lastUpdated)}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Offline Sync Notice */}
      {!navigator.onLine && (
        <Card className="p-3 sm:p-4 bg-warning/10 border-warning/20">
          <div className="flex items-center gap-2 text-warning-foreground text-sm sm:text-base">
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">{t.syncOffline}</span>
          </div>
        </Card>
      )}
    </div>
  );
};