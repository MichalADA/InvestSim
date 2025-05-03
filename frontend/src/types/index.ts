
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: Date;
  totalPortfolioValue: number;
  totalProfit: number;
  totalProfitPercentage: number;
}

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  description?: string;
  initialInvestment: number;
  currentValue: number;
  profit: number;
  profitPercentage: number;
  assets: Asset[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Asset {
  id: string;
  ticker: string;
  name: string;
  type: AssetType;
  price: number;
  priceChange: number;
  priceChangePercentage: number;
  quantity?: number;
  value?: number;
  averageBuyPrice?: number;
  profit?: number;
  profitPercentage?: number;
  icon?: string;
}

export enum AssetType {
  STOCK = 'stock',
  CRYPTO = 'crypto',
  ETF = 'etf',
  COMMODITY = 'commodity',
}

export interface Transaction {
  id: string;
  portfolioId: string;
  assetId: string;
  type: TransactionType;
  quantity: number;
  price: number;
  totalAmount: number;
  timestamp: Date;
  asset?: Asset;
}

export enum TransactionType {
  BUY = 'buy',
  SELL = 'sell',
}

export interface MarketOverview {
  trending: Asset[];
  gainers: Asset[];
  losers: Asset[];
}

export interface PricePoint {
  date: string;
  value: number;
}

export interface PriceHistory {
  ticker: string;
  data: PricePoint[];
  timeframe: Timeframe;
}

export enum Timeframe {
  DAY = '1D',
  WEEK = '1W',
  MONTH = '1M',
  THREE_MONTHS = '3M',
  YEAR = '1Y',
  FIVE_YEARS = '5Y',
  ALL = 'ALL',
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: Date;
  relatedTickers?: string[];
}
