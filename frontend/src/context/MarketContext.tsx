
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Asset, AssetType, MarketOverview, PriceHistory, Timeframe } from '@/types';
import { useAuth } from './AuthContext';

interface MarketContextType {
  marketAssets: Asset[];
  marketOverview: MarketOverview;
  isLoading: boolean;
  error: string | null;
  searchAssets: (query: string) => Asset[];
  getAssetById: (id: string) => Asset | undefined;
  getAssetByTicker: (ticker: string) => Asset | undefined;
  getPriceHistory: (ticker: string, timeframe: Timeframe) => Promise<PriceHistory>;
}

// Mock market data
const mockMarketAssets: Asset[] = [
  {
    id: 'asset-1',
    ticker: 'AAPL',
    name: 'Apple Inc.',
    type: AssetType.STOCK,
    price: 187.45,
    priceChange: 2.45,
    priceChangePercentage: 1.32,
    icon: '🍎',
  },
  {
    id: 'asset-2',
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    type: AssetType.STOCK,
    price: 378.92,
    priceChange: -1.23,
    priceChangePercentage: -0.32,
    icon: '🪟',
  },
  {
    id: 'asset-3',
    ticker: 'BTC',
    name: 'Bitcoin',
    type: AssetType.CRYPTO,
    price: 43250.75,
    priceChange: 1250.25,
    priceChangePercentage: 2.98,
    icon: '₿',
  },
  {
    id: 'asset-4',
    ticker: 'JNJ',
    name: 'Johnson & Johnson',
    type: AssetType.STOCK,
    price: 153.42,
    priceChange: 0.87,
    priceChangePercentage: 0.57,
    icon: '💊',
  },
  {
    id: 'asset-5',
    ticker: 'KO',
    name: 'Coca-Cola Company',
    type: AssetType.STOCK,
    price: 62.15,
    priceChange: 0.32,
    priceChangePercentage: 0.52,
    icon: '🥤',
  },
  {
    id: 'asset-6',
    ticker: 'VTI',
    name: 'Vanguard Total Stock Market ETF',
    type: AssetType.ETF,
    price: 251.23,
    priceChange: 1.15,
    priceChangePercentage: 0.46,
    icon: '📊',
  },
  {
    id: 'asset-7',
    ticker: 'AMZN',
    name: 'Amazon.com Inc.',
    type: AssetType.STOCK,
    price: 178.15,
    priceChange: 3.24,
    priceChangePercentage: 1.85,
    icon: '📦',
  },
  {
    id: 'asset-8',
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    type: AssetType.STOCK,
    price: 142.68,
    priceChange: 1.75,
    priceChangePercentage: 1.24,
    icon: '🔍',
  },
  {
    id: 'asset-9',
    ticker: 'TSLA',
    name: 'Tesla, Inc.',
    type: AssetType.STOCK,
    price: 248.42,
    priceChange: -5.38,
    priceChangePercentage: -2.12,
    icon: '🚗',
  },
  {
    id: 'asset-10',
    ticker: 'ETH',
    name: 'Ethereum',
    type: AssetType.CRYPTO,
    price: 2345.18,
    priceChange: 45.67,
    priceChangePercentage: 1.98,
    icon: 'Ξ',
  },
  {
    id: 'asset-11',
    ticker: 'V',
    name: 'Visa Inc.',
    type: AssetType.STOCK,
    price: 276.43,
    priceChange: 1.25,
    priceChangePercentage: 0.45,
    icon: '💳',
  },
  {
    id: 'asset-12',
    ticker: 'JPM',
    name: 'JPMorgan Chase & Co.',
    type: AssetType.STOCK,
    price: 187.45,
    priceChange: -0.78,
    priceChangePercentage: -0.41,
    icon: '🏦',
  },
  {
    id: 'asset-13',
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    type: AssetType.STOCK,
    price: 924.75,
    priceChange: 23.45,
    priceChangePercentage: 2.60,
    icon: '🎮',
  },
  {
    id: 'asset-14',
    ticker: 'GLD',
    name: 'SPDR Gold Shares',
    type: AssetType.ETF,
    price: 198.37,
    priceChange: 2.14,
    priceChangePercentage: 1.09,
    icon: '🥇',
  },
  {
    id: 'asset-15',
    ticker: 'MRK',
    name: 'Merck & Co., Inc.',
    type: AssetType.STOCK,
    price: 125.78,
    priceChange: -1.32,
    priceChangePercentage: -1.04,
    icon: '💉',
  },
];

// Helper function to generate realistic price history data
const generatePriceHistory = (basePrice: number, volatility: number, days: number) => {
  const now = new Date();
  const data = [];
  let price = basePrice;

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add some random movement to the price
    const change = (Math.random() - 0.5) * volatility * price;
    price += change;
    
    // Ensure price stays positive
    price = Math.max(price, 0.1);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: price,
    });
  }
  
  return data;
};

const MarketContext = createContext<MarketContextType>({} as MarketContextType);

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [marketAssets, setMarketAssets] = useState<Asset[]>([]);
  const [marketOverview, setMarketOverview] = useState<MarketOverview>({
    trending: [],
    gainers: [],
    losers: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load market data
  useEffect(() => {
    const loadMarketData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setMarketAssets(mockMarketAssets);
        
        // Prepare market overview
        const sortedByVolume = [...mockMarketAssets].sort(() => Math.random() - 0.5).slice(0, 5);
        const sortedByGain = [...mockMarketAssets].sort((a, b) => b.priceChangePercentage - a.priceChangePercentage).slice(0, 5);
        const sortedByLoss = [...mockMarketAssets].sort((a, b) => a.priceChangePercentage - b.priceChangePercentage).slice(0, 5);
        
        setMarketOverview({
          trending: sortedByVolume,
          gainers: sortedByGain,
          losers: sortedByLoss,
        });
      } catch (error) {
        setError('Failed to load market data');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMarketData();
  }, []);

  const searchAssets = (query: string): Asset[] => {
    if (!query || query.trim() === '') {
      return [];
    }
    
    const lowercasedQuery = query.toLowerCase().trim();
    
    return marketAssets.filter(
      asset => 
        asset.ticker.toLowerCase().includes(lowercasedQuery) ||
        asset.name.toLowerCase().includes(lowercasedQuery)
    );
  };

  const getAssetById = (id: string): Asset | undefined => {
    return marketAssets.find(asset => asset.id === id);
  };

  const getAssetByTicker = (ticker: string): Asset | undefined => {
    return marketAssets.find(asset => asset.ticker === ticker);
  };

  const getPriceHistory = async (ticker: string, timeframe: Timeframe): Promise<PriceHistory> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const asset = getAssetByTicker(ticker);
    if (!asset) {
      throw new Error(`Asset with ticker ${ticker} not found`);
    }
    
    // Generate appropriate number of days based on timeframe
    let days = 30;
    switch (timeframe) {
      case Timeframe.DAY: days = 1; break;
      case Timeframe.WEEK: days = 7; break;
      case Timeframe.MONTH: days = 30; break;
      case Timeframe.THREE_MONTHS: days = 90; break;
      case Timeframe.YEAR: days = 365; break;
      case Timeframe.FIVE_YEARS: days = 365 * 5; break;
      case Timeframe.ALL: days = 365 * 10; break;
    }
    
    // Generate price history with appropriate volatility based on asset type
    const volatility = asset.type === AssetType.CRYPTO ? 0.05 : 0.02;
    const data = generatePriceHistory(asset.price, volatility, days);
    
    return {
      ticker,
      data,
      timeframe,
    };
  };

  return (
    <MarketContext.Provider
      value={{
        marketAssets,
        marketOverview,
        isLoading,
        error,
        searchAssets,
        getAssetById,
        getAssetByTicker,
        getPriceHistory,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => useContext(MarketContext);
