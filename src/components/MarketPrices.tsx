import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Search, 
  MapPin, 
  Calendar,
  Filter,
  Download,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface MarketPrice {
  state: string;
  commodity: string;
  market: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  date: string;
}

interface MarketPricesProps {
  language: string;
}

const API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';
const API_BASE_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

export default function MarketPrices({ language }: MarketPricesProps) {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [sortBy, setSortBy] = useState('modal_price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const translations = {
    en: {
      title: 'Market Prices',
      subtitle: 'Current daily prices from various markets (Mandi)',
      search: 'Search commodities...',
      filterBy: 'Filter by',
      state: 'State',
      commodity: 'Commodity',
      sortBy: 'Sort by',
      price: 'Price',
      market: 'Market',
      date: 'Date',
      minPrice: 'Min Price',
      maxPrice: 'Max Price',
      modalPrice: 'Modal Price',
      refresh: 'Refresh',
      download: 'Download',
      noData: 'No market data available',
      error: 'Failed to fetch market prices',
      retry: 'Retry',
      lastUpdated: 'Last updated',
      loading: 'Loading market prices...',
      allStates: 'All States',
      allCommodities: 'All Commodities',
      priceRange: 'Price Range',
      trend: 'Trend',
      up: 'Up',
      down: 'Down',
      stable: 'Stable'
    },
    hi: {
      title: 'बाजार भाव',
      subtitle: 'विभिन्न बाजारों (मंडी) से वर्तमान दैनिक भाव',
      search: 'फसल खोजें...',
      filterBy: 'फिल्टर करें',
      state: 'राज्य',
      commodity: 'फसल',
      sortBy: 'क्रमबद्ध करें',
      price: 'कीमत',
      market: 'बाजार',
      date: 'तारीख',
      minPrice: 'न्यूनतम भाव',
      maxPrice: 'अधिकतम भाव',
      modalPrice: 'मोडल भाव',
      refresh: 'रिफ्रेश',
      download: 'डाउनलोड',
      noData: 'कोई बाजार डेटा उपलब्ध नहीं',
      error: 'बाजार भाव प्राप्त करने में विफल',
      retry: 'पुनः प्रयास',
      lastUpdated: 'अंतिम अपडेट',
      loading: 'बाजार भाव लोड हो रहे हैं...',
      allStates: 'सभी राज्य',
      allCommodities: 'सभी फसलें',
      priceRange: 'कीमत सीमा',
      trend: 'ट्रेंड',
      up: 'ऊपर',
      down: 'नीचे',
      stable: 'स्थिर'
    },
    pa: {
      title: 'ਬਾਜ਼ਾਰ ਭਾਅ',
      subtitle: 'ਵੱਖ-ਵੱਖ ਬਾਜ਼ਾਰਾਂ (ਮੰਡੀ) ਤੋਂ ਮੌਜੂਦਾ ਰੋਜ਼ਾਨਾ ਭਾਅ',
      search: 'ਫਸਲ ਖੋਜੋ...',
      filterBy: 'ਫਿਲਟਰ ਕਰੋ',
      state: 'ਰਾਜ',
      commodity: 'ਫਸਲ',
      sortBy: 'ਕ੍ਰਮਬੱਧ ਕਰੋ',
      price: 'ਕੀਮਤ',
      market: 'ਬਾਜ਼ਾਰ',
      date: 'ਤਾਰੀਖ',
      minPrice: 'ਘੱਟੋ-ਘੱਟ ਭਾਅ',
      maxPrice: 'ਵੱਧ ਤੋਂ ਵੱਧ ਭਾਅ',
      modalPrice: 'ਮੋਡਲ ਭਾਅ',
      refresh: 'ਰਿਫਰੈਸ਼',
      download: 'ਡਾਉਨਲੋਡ',
      noData: 'ਕੋਈ ਬਾਜ਼ਾਰ ਡੇਟਾ ਉਪਲਬਧ ਨਹੀਂ',
      error: 'ਬਾਜ਼ਾਰ ਭਾਅ ਪ੍ਰਾਪਤ ਕਰਨ ਵਿੱਚ ਅਸਫਲ',
      retry: 'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼',
      lastUpdated: 'ਆਖਰੀ ਅਪਡੇਟ',
      loading: 'ਬਾਜ਼ਾਰ ਭਾਅ ਲੋਡ ਹੋ ਰਹੇ ਹਨ...',
      allStates: 'ਸਾਰੇ ਰਾਜ',
      allCommodities: 'ਸਾਰੀਆਂ ਫਸਲਾਂ',
      priceRange: 'ਕੀਮਤ ਸੀਮਾ',
      trend: 'ਟ੍ਰੈਂਡ',
      up: 'ਉੱਪਰ',
      down: 'ਹੇਠਾਂ',
      stable: 'ਸਥਿਰ'
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const fetchMarketPrices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching market prices...');
      
      const params = new URLSearchParams({
        'api-key': API_KEY,
        format: 'json',
        limit: '50',
        offset: '0'
      });

      const url = `${API_BASE_URL}?${params}`;
      console.log('API URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.records && Array.isArray(data.records)) {
        console.log('Records found:', data.records.length);
        const formattedPrices = data.records.map((record: any) => ({
          state: record.state || 'Unknown',
          commodity: record.commodity || 'Unknown',
          market: record.market || 'Unknown',
          min_price: parseFloat(record.min_price) || 0,
          max_price: parseFloat(record.max_price) || 0,
          modal_price: parseFloat(record.modal_price) || 0,
          date: record.date || new Date().toISOString().split('T')[0]
        }));
        
        console.log('Formatted prices:', formattedPrices);
        setPrices(formattedPrices);
        setLastUpdated(new Date());
      } else {
        console.error('Invalid data format:', data);
        throw new Error('Invalid data format received');
      }
    } catch (err) {
      console.error('Error fetching market prices:', err);
      console.log('Using fallback mock data...');
      
      // Fallback mock data for testing
      const mockData: MarketPrice[] = [
        {
          state: 'Punjab',
          commodity: 'Wheat',
          market: 'Amritsar',
          min_price: 2200,
          max_price: 2400,
          modal_price: 2300,
          date: new Date().toISOString().split('T')[0]
        },
        {
          state: 'Haryana',
          commodity: 'Rice',
          market: 'Karnal',
          min_price: 1800,
          max_price: 2000,
          modal_price: 1900,
          date: new Date().toISOString().split('T')[0]
        },
        {
          state: 'Uttar Pradesh',
          commodity: 'Sugarcane',
          market: 'Meerut',
          min_price: 320,
          max_price: 350,
          modal_price: 335,
          date: new Date().toISOString().split('T')[0]
        },
        {
          state: 'Maharashtra',
          commodity: 'Cotton',
          market: 'Nagpur',
          min_price: 6500,
          max_price: 6800,
          modal_price: 6650,
          date: new Date().toISOString().split('T')[0]
        },
        {
          state: 'Gujarat',
          commodity: 'Groundnut',
          market: 'Rajkot',
          min_price: 4500,
          max_price: 4800,
          modal_price: 4650,
          date: new Date().toISOString().split('T')[0]
        }
      ];
      
      setPrices(mockData);
      setLastUpdated(new Date());
      setError('Using offline data - API connection failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketPrices();
  }, []);

  const filteredPrices = prices.filter(price => {
    const matchesSearch = price.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         price.market.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         price.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = !selectedState || price.state === selectedState;
    const matchesCommodity = !selectedCommodity || price.commodity === selectedCommodity;
    
    return matchesSearch && matchesState && matchesCommodity;
  });

  const sortedPrices = [...filteredPrices].sort((a, b) => {
    const aValue = a[sortBy as keyof MarketPrice] as number;
    const bValue = b[sortBy as keyof MarketPrice] as number;
    
    if (sortOrder === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  const uniqueStates = Array.from(new Set(prices.map(p => p.state))).sort();
  const uniqueCommodities = Array.from(new Set(prices.map(p => p.commodity))).sort();

  const getPriceTrend = (price: MarketPrice) => {
    const range = price.max_price - price.min_price;
    const modalPosition = (price.modal_price - price.min_price) / range;
    
    if (modalPosition > 0.7) return 'up';
    if (modalPosition < 0.3) return 'down';
    return 'stable';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const downloadData = () => {
    const csvContent = [
      ['Commodity', 'Market', 'State', 'Min Price', 'Max Price', 'Modal Price', 'Date'],
      ...sortedPrices.map(price => [
        price.commodity,
        price.market,
        price.state,
        price.min_price.toString(),
        price.max_price.toString(),
        price.modal_price.toString(),
        price.date
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market-prices-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchMarketPrices}>
              <RefreshCw className="w-4 h-4 mr-2" />
              {t.retry}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-2">
          {t.title}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          {t.subtitle}
        </p>
        {lastUpdated && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {t.lastUpdated}: {lastUpdated.toLocaleString()}
          </p>
        )}
      </div>

      {/* Controls */}
      <Card className="p-3 sm:p-4">
        <div className="space-y-3 sm:space-y-4">
          {/* Search and Filters Row */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9 sm:h-10"
              />
            </div>
                <Button
                  onClick={fetchMarketPrices}
                  disabled={loading}
                  size="sm"
                  className="h-9 sm:h-10 px-3 sm:px-4"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline ml-2">{t.refresh}</span>
                </Button>
                <Button
                  onClick={() => {
                    console.log('Current prices state:', prices);
                    console.log('Current loading state:', loading);
                    console.log('Current error state:', error);
                  }}
                  variant="outline"
                  size="sm"
                  className="h-9 sm:h-10 px-3 sm:px-4"
                >
                  Debug
                </Button>
            <Button
              onClick={downloadData}
              variant="outline"
              size="sm"
              className="h-9 sm:h-10 px-3 sm:px-4"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">{t.download}</span>
            </Button>
          </div>

          {/* Filter Row */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="h-9 sm:h-10">
                <SelectValue placeholder={t.state} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t.allStates}</SelectItem>
                {uniqueStates.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
              <SelectTrigger className="h-9 sm:h-10">
                <SelectValue placeholder={t.commodity} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t.allCommodities}</SelectItem>
                {uniqueCommodities.map(commodity => (
                  <SelectItem key={commodity} value={commodity}>{commodity}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-9 sm:h-10">
                <SelectValue placeholder={t.sortBy} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modal_price">{t.modalPrice}</SelectItem>
                <SelectItem value="min_price">{t.minPrice}</SelectItem>
                <SelectItem value="max_price">{t.maxPrice}</SelectItem>
                <SelectItem value="commodity">{t.commodity}</SelectItem>
                <SelectItem value="state">{t.state}</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="h-9 sm:h-10 px-3 sm:px-4"
            >
              {sortOrder === 'asc' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? t.loading : `${sortedPrices.length} ${t.commodity.toLowerCase()}`}
        </p>
        {sortedPrices.length > 0 && (
          <Badge variant="secondary">
            {sortedPrices.length} {t.commodity.toLowerCase()}
          </Badge>
        )}
      </div>

      {/* Price Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {Array(8).fill(0).map((_, index) => (
            <Card key={index} className="p-3 sm:p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2 mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      ) : sortedPrices.length === 0 ? (
        <Card className="p-6 sm:p-8 text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold mb-2">{t.noData}</h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            {searchTerm || selectedState || selectedCommodity 
              ? 'Try adjusting your filters'
              : 'No market data available at the moment'
            }
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {sortedPrices.map((price, index) => {
            const trend = getPriceTrend(price);
            return (
              <Card key={index} className="p-3 sm:p-4 hover:shadow-md transition-shadow">
                <CardHeader className="p-0 pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm sm:text-base font-semibold line-clamp-2">
                      {price.commodity}
                    </CardTitle>
                    <Badge 
                      variant={trend === 'up' ? 'default' : trend === 'down' ? 'destructive' : 'secondary'}
                      className="ml-2 flex-shrink-0"
                    >
                      {trend === 'up' ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : trend === 'down' ? (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      ) : null}
                      {t[trend as keyof typeof t] || trend}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0 space-y-2">
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{price.market}, {price.state}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">{t.modalPrice}:</span>
                      <span className="font-semibold text-sm sm:text-base">
                        {formatPrice(price.modal_price)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">{t.minPrice}:</span>
                      <span>{formatPrice(price.min_price)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">{t.maxPrice}:</span>
                      <span>{formatPrice(price.max_price)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1 border-t">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(price.date).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

