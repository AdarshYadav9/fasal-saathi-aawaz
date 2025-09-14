import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

interface MarketPrice {
  state: string;
  commodity: string;
  market: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  date: string;
}

const BACKEND_API_URL = 'http://127.0.0.1:8000/api/market-prices/prices/';

export default function MarketPrices() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketPrices = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(
          `${BACKEND_API_URL}?date=${today}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch market prices');
        }

        const data = await response.json();
        setPrices(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMarketPrices();
  }, []);

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Today's Market Prices</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          // Loading skeletons
          Array(6).fill(0).map((_, index) => (
            <Card key={index} className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </Card>
          ))
        ) : (
          // Actual price cards
          prices.map((price, index) => (
            <Card key={index} className="p-4">
              <h3 className="font-semibold text-lg">{price.commodity}</h3>
              <p className="text-sm text-gray-600">{price.market}, {price.state}</p>
              <div className="mt-2">
                <p>Min: ₹{price.min_price}</p>
                <p>Max: ₹{price.max_price}</p>
                <p>Modal: ₹{price.modal_price}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

