
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Portfolio, Asset, Transaction, TransactionType, AssetType } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface PortfolioContextType {
  portfolios: Portfolio[];
  selectedPortfolio: Portfolio | null;
  isLoading: boolean;
  error: string | null;
  createPortfolio: (name: string, description: string, initialInvestment: number) => Promise<void>;
  selectPortfolio: (id: string) => void;
  executeTransaction: (
    portfolioId: string,
    assetId: string,
    type: TransactionType,
    quantity: number,
    price: number
  ) => Promise<void>;
  getPortfolioTransactions: (portfolioId: string) => Promise<Transaction[]>;
}

// Mock data
const mockPortfolios: Portfolio[] = [
  {
    id: 'portfolio-1',
    userId: 'user-1',
    name: 'Tech Growth',
    description: 'Portfolio focused on high-growth tech companies',
    initialInvestment: 10000,
    currentValue: 12453.78,
    profit: 2453.78,
    profitPercentage: 24.53,
    assets: [
      {
        id: 'asset-1',
        ticker: 'AAPL',
        name: 'Apple Inc.',
        type: AssetType.STOCK,
        price: 187.45,
        priceChange: 2.45,
        priceChangePercentage: 1.32,
        quantity: 10,
        value: 1874.5,
        averageBuyPrice: 150.25,
        profit: 371.95,
        profitPercentage: 24.76,
      },
      {
        id: 'asset-2',
        ticker: 'MSFT',
        name: 'Microsoft Corporation',
        type: AssetType.STOCK,
        price: 378.92,
        priceChange: -1.23,
        priceChangePercentage: -0.32,
        quantity: 5,
        value: 1894.6,
        averageBuyPrice: 320.10,
        profit: 294.1,
        profitPercentage: 18.38,
      },
      {
        id: 'asset-3',
        ticker: 'BTC',
        name: 'Bitcoin',
        type: AssetType.CRYPTO,
        price: 43250.75,
        priceChange: 1250.25,
        priceChangePercentage: 2.98,
        quantity: 0.2,
        value: 8650.15,
        averageBuyPrice: 37500.0,
        profit: 1150.15,
        profitPercentage: 15.33,
      },
    ],
    createdAt: new Date('2023-01-20'),
    updatedAt: new Date('2023-05-15'),
  },
  {
    id: 'portfolio-2',
    userId: 'user-1',
    name: 'Dividend Income',
    description: 'Stable dividend-paying stocks',
    initialInvestment: 15000,
    currentValue: 16245.32,
    profit: 1245.32,
    profitPercentage: 8.30,
    assets: [
      {
        id: 'asset-4',
        ticker: 'JNJ',
        name: 'Johnson & Johnson',
        type: AssetType.STOCK,
        price: 153.42,
        priceChange: 0.87,
        priceChangePercentage: 0.57,
        quantity: 20,
        value: 3068.4,
        averageBuyPrice: 145.30,
        profit: 162.4,
        profitPercentage: 5.59,
      },
      {
        id: 'asset-5',
        ticker: 'KO',
        name: 'Coca-Cola Company',
        type: AssetType.STOCK,
        price: 62.15,
        priceChange: 0.32,
        priceChangePercentage: 0.52,
        quantity: 50,
        value: 3107.5,
        averageBuyPrice: 58.75,
        profit: 170,
        profitPercentage: 5.79,
      },
      {
        id: 'asset-6',
        ticker: 'VTI',
        name: 'Vanguard Total Stock Market ETF',
        type: AssetType.ETF,
        price: 251.23,
        priceChange: 1.15,
        priceChangePercentage: 0.46,
        quantity: 40,
        value: 10049.2,
        averageBuyPrice: 235.80,
        profit: 617.2,
        profitPercentage: 6.54,
      },
    ],
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-05-12'),
  },
];

const mockTransactions: Transaction[] = [
  {
    id: 'transaction-1',
    portfolioId: 'portfolio-1',
    assetId: 'asset-1',
    type: TransactionType.BUY,
    quantity: 5,
    price: 145.32,
    totalAmount: 726.6,
    timestamp: new Date('2023-01-25'),
  },
  {
    id: 'transaction-2',
    portfolioId: 'portfolio-1',
    assetId: 'asset-1',
    type: TransactionType.BUY,
    quantity: 5,
    price: 155.18,
    totalAmount: 775.9,
    timestamp: new Date('2023-02-15'),
  },
  {
    id: 'transaction-3',
    portfolioId: 'portfolio-1',
    assetId: 'asset-2',
    type: TransactionType.BUY,
    quantity: 3,
    price: 310.25,
    totalAmount: 930.75,
    timestamp: new Date('2023-01-28'),
  },
  {
    id: 'transaction-4',
    portfolioId: 'portfolio-1',
    assetId: 'asset-2',
    type: TransactionType.BUY,
    quantity: 2,
    price: 334.87,
    totalAmount: 669.74,
    timestamp: new Date('2023-03-10'),
  },
  {
    id: 'transaction-5',
    portfolioId: 'portfolio-1',
    assetId: 'asset-3',
    type: TransactionType.BUY,
    quantity: 0.2,
    price: 37500.0,
    totalAmount: 7500.0,
    timestamp: new Date('2023-02-05'),
  },
];

const PortfolioContext = createContext<PortfolioContextType>({} as PortfolioContextType);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load portfolios when user changes
  useEffect(() => {
    const loadPortfolios = async () => {
      if (!user) {
        setPortfolios([]);
        setSelectedPortfolio(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setPortfolios(mockPortfolios);
        
        // Select first portfolio by default
        if (mockPortfolios.length > 0 && !selectedPortfolio) {
          setSelectedPortfolio(mockPortfolios[0]);
        }
      } catch (error) {
        setError('Failed to load portfolios');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPortfolios();
  }, [user]);

  const createPortfolio = async (name: string, description: string, initialInvestment: number) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newPortfolio: Portfolio = {
        id: `portfolio-${Date.now()}`,
        userId: user.id,
        name,
        description,
        initialInvestment,
        currentValue: initialInvestment,
        profit: 0,
        profitPercentage: 0,
        assets: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setPortfolios(prev => [...prev, newPortfolio]);
      setSelectedPortfolio(newPortfolio);
      toast.success('Portfolio created successfully');
    } catch (error) {
      setError('Failed to create portfolio');
      toast.error('Failed to create portfolio');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectPortfolio = (id: string) => {
    const portfolio = portfolios.find(p => p.id === id);
    if (portfolio) {
      setSelectedPortfolio(portfolio);
    }
  };

  const executeTransaction = async (
    portfolioId: string,
    assetId: string,
    type: TransactionType,
    quantity: number,
    price: number
  ) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create a new transaction
      const newTransaction: Transaction = {
        id: `transaction-${Date.now()}`,
        portfolioId,
        assetId,
        type,
        quantity,
        price,
        totalAmount: quantity * price,
        timestamp: new Date(),
      };

      // Update portfolios state with the new transaction
      setPortfolios(prevPortfolios =>
        prevPortfolios.map(portfolio => {
          if (portfolio.id !== portfolioId) return portfolio;

          // Find the asset in the portfolio
          const assetIndex = portfolio.assets.findIndex(a => a.id === assetId);
          let updatedAssets = [...portfolio.assets];
          let updatedPortfolioValue = portfolio.currentValue;

          if (type === TransactionType.BUY) {
            if (assetIndex >= 0) {
              // Update existing asset
              const asset = portfolio.assets[assetIndex];
              const newQuantity = (asset.quantity || 0) + quantity;
              const newValue = newQuantity * price;
              const newAvgPrice = ((asset.averageBuyPrice || 0) * (asset.quantity || 0) + price * quantity) / newQuantity;
              const newProfit = (price - newAvgPrice) * newQuantity;
              const newProfitPercentage = ((price - newAvgPrice) / newAvgPrice) * 100;

              updatedAssets[assetIndex] = {
                ...asset,
                quantity: newQuantity,
                value: newValue,
                averageBuyPrice: newAvgPrice,
                profit: newProfit,
                profitPercentage: newProfitPercentage,
              };
            } else {
              // Add new asset
              const marketAsset = mockMarketAssets.find(a => a.id === assetId);
              if (!marketAsset) throw new Error("Asset not found");

              updatedAssets.push({
                ...marketAsset,
                quantity,
                value: quantity * price,
                averageBuyPrice: price,
                profit: 0,
                profitPercentage: 0,
              });
            }

            // Update portfolio value for buy
            updatedPortfolioValue += quantity * price;
          } else if (type === TransactionType.SELL && assetIndex >= 0) {
            // Handle sell transaction
            const asset = portfolio.assets[assetIndex];
            const currentQuantity = asset.quantity || 0;
            
            if (quantity > currentQuantity) {
              throw new Error("Cannot sell more than you own");
            }
            
            const newQuantity = currentQuantity - quantity;
            
            if (newQuantity === 0) {
              // Remove asset if quantity becomes zero
              updatedAssets = updatedAssets.filter(a => a.id !== assetId);
            } else {
              // Update asset with new quantity
              const newValue = newQuantity * price;
              
              updatedAssets[assetIndex] = {
                ...asset,
                quantity: newQuantity,
                value: newValue,
              };
            }
            
            // Update portfolio value for sell
            updatedPortfolioValue -= quantity * price;
          }

          // Calculate new portfolio metrics
          const profit = updatedPortfolioValue - portfolio.initialInvestment;
          const profitPercentage = (profit / portfolio.initialInvestment) * 100;

          const updatedPortfolio = {
            ...portfolio,
            assets: updatedAssets,
            currentValue: updatedPortfolioValue,
            profit,
            profitPercentage,
            updatedAt: new Date(),
          };

          // If this is the selected portfolio, update it
          if (selectedPortfolio?.id === portfolioId) {
            setSelectedPortfolio(updatedPortfolio);
          }

          return updatedPortfolio;
        })
      );

      toast.success(`Transaction completed: ${type === TransactionType.BUY ? 'Bought' : 'Sold'} ${quantity} at $${price}`);
    } catch (error) {
      setError('Transaction failed');
      toast.error('Transaction failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPortfolioTransactions = async (portfolioId: string): Promise<Transaction[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockTransactions.filter(t => t.portfolioId === portfolioId);
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolios,
        selectedPortfolio,
        isLoading,
        error,
        createPortfolio,
        selectPortfolio,
        executeTransaction,
        getPortfolioTransactions,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);

// Mock market assets for transactions
const mockMarketAssets: Asset[] = [
  {
    id: 'asset-1',
    ticker: 'AAPL',
    name: 'Apple Inc.',
    type: AssetType.STOCK,
    price: 187.45,
    priceChange: 2.45,
    priceChangePercentage: 1.32,
  },
  {
    id: 'asset-2',
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    type: AssetType.STOCK,
    price: 378.92,
    priceChange: -1.23,
    priceChangePercentage: -0.32,
  },
  {
    id: 'asset-3',
    ticker: 'BTC',
    name: 'Bitcoin',
    type: AssetType.CRYPTO,
    price: 43250.75,
    priceChange: 1250.25,
    priceChangePercentage: 2.98,
  },
  {
    id: 'asset-4',
    ticker: 'JNJ',
    name: 'Johnson & Johnson',
    type: AssetType.STOCK,
    price: 153.42,
    priceChange: 0.87,
    priceChangePercentage: 0.57,
  },
  {
    id: 'asset-5',
    ticker: 'KO',
    name: 'Coca-Cola Company',
    type: AssetType.STOCK,
    price: 62.15,
    priceChange: 0.32,
    priceChangePercentage: 0.52,
  },
  {
    id: 'asset-6',
    ticker: 'VTI',
    name: 'Vanguard Total Stock Market ETF',
    type: AssetType.ETF,
    price: 251.23,
    priceChange: 1.15,
    priceChangePercentage: 0.46,
  },
];
