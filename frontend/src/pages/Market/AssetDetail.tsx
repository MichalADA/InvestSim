
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, PlusCircle, TrendingUp, TrendingDown, Info, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { DataCard } from '@/components/ui/data-card';
import { PriceChart } from '@/components/charts/PriceChart';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { useMarket } from '@/context/MarketContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { Timeframe, TransactionType } from '@/types';

const timeframeOptions = [
  { value: Timeframe.DAY, label: '1D' },
  { value: Timeframe.WEEK, label: '1W' },
  { value: Timeframe.MONTH, label: '1M' },
  { value: Timeframe.THREE_MONTHS, label: '3M' },
  { value: Timeframe.YEAR, label: '1Y' },
  { value: Timeframe.FIVE_YEARS, label: '5Y' },
];

const AssetDetail = () => {
  const { ticker = '' } = useParams<{ ticker: string }>();
  const { getAssetByTicker, getPriceHistory } = useMarket();
  const { portfolios, executeTransaction } = usePortfolio();
  
  const [asset, setAsset] = useState<any>(null);
  const [priceHistory, setPriceHistory] = useState<any>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>(Timeframe.MONTH);
  const [isChartLoading, setIsChartLoading] = useState(true);
  
  // Transaction dialog state
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  // Load asset data
  useEffect(() => {
    const loadAsset = () => {
      const foundAsset = getAssetByTicker(ticker);
      if (foundAsset) {
        setAsset(foundAsset);
      }
    };
    
    loadAsset();
  }, [ticker, getAssetByTicker]);

  // Load price history when asset or timeframe changes
  useEffect(() => {
    const loadPriceHistory = async () => {
      if (asset) {
        setIsChartLoading(true);
        try {
          const history = await getPriceHistory(asset.ticker, selectedTimeframe);
          setPriceHistory(history);
        } catch (error) {
          console.error('Failed to load price history:', error);
        } finally {
          setIsChartLoading(false);
        }
      }
    };
    
    loadPriceHistory();
  }, [asset, selectedTimeframe, getPriceHistory]);

  const handleBuyAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPortfolioId || !quantity || !asset) {
      return;
    }
    
    setIsExecuting(true);
    
    try {
      await executeTransaction(
        selectedPortfolioId,
        asset.id,
        TransactionType.BUY,
        parseFloat(quantity),
        asset.price
      );
      
      setIsTransactionDialogOpen(false);
      setSelectedPortfolioId('');
      setQuantity('');
    } catch (error) {
      console.error('Failed to buy asset:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  if (!asset) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground mb-4">Asset not found</p>
        <Link to="/market">
          <Button>Back to Market</Button>
        </Link>
      </div>
    );
  }

  const isPriceUp = asset.priceChange >= 0;

  return (
    <div>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <span className="text-2xl">{asset.icon}</span>
            <span>{asset.name} ({asset.ticker})</span>
          </div>
        }
        description={`Asset type: ${asset.type}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" /> Buy Asset
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Buy {asset.ticker}</DialogTitle>
                  <DialogDescription>
                    Add this asset to one of your portfolios
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleBuyAsset}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="portfolio">Select Portfolio</Label>
                      <Select 
                        value={selectedPortfolioId} 
                        onValueChange={setSelectedPortfolioId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a portfolio" />
                        </SelectTrigger>
                        <SelectContent>
                          {portfolios.map((portfolio) => (
                            <SelectItem key={portfolio.id} value={portfolio.id}>
                              {portfolio.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="Enter quantity"
                      />
                    </div>
                    
                    <div className="text-sm bg-muted/50 p-3 rounded-md">
                      <p className="font-medium">Transaction Summary</p>
                      <div className="mt-2 space-y-1">
                        <p>Asset: {asset.name} ({asset.ticker})</p>
                        <p>Current Price: {formatCurrency(asset.price)}</p>
                        {quantity && (
                          <p>Total Cost: {formatCurrency(asset.price * parseFloat(quantity || '0'))}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isExecuting || !selectedPortfolioId || !quantity}>
                      {isExecuting ? 'Processing...' : 'Confirm Purchase'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Chart and info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Price overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DataCard
              title="Current Price"
              value={formatCurrency(asset.price)}
              description="Last traded price"
            />
            <DataCard
              title="24h Change"
              value={formatCurrency(asset.priceChange)}
              trend={isPriceUp ? 'up' : 'down'}
              trendValue={formatPercentage(asset.priceChangePercentage)}
              description="24-hour change"
            />
            <DataCard
              title="Market Cap"
              value={formatCurrency(asset.price * 1000000)} // Mock market cap
              description="Total market value"
            />
          </div>

          {/* Price chart */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Price Chart</CardTitle>
                <div className="flex items-center gap-1">
                  {timeframeOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={selectedTimeframe === option.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTimeframe(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <PriceChart 
                data={priceHistory}
                isLoading={isChartLoading}
                height={400}
              />
            </CardContent>
          </Card>

          {/* Asset information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Asset Information</CardTitle>
              <CardDescription>Detailed information about {asset.ticker}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Overview</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Asset Type</span>
                    <span>{asset.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Symbol</span>
                    <span>{asset.ticker}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Full Name</span>
                    <span>{asset.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Price</span>
                    <span>{formatCurrency(asset.price)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Performance</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">24h Change</span>
                    <span className={isPriceUp ? 'text-success' : 'text-destructive'}>
                      {isPriceUp ? '+' : ''}{formatCurrency(asset.priceChange)} ({formatPercentage(asset.priceChangePercentage)})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">7d High</span>
                    <span>{formatCurrency(asset.price * 1.05)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">7d Low</span>
                    <span>{formatCurrency(asset.price * 0.95)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trading Volume (24h)</span>
                    <span>{formatCurrency(asset.price * 1000000)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Buy panel and analytics */}
        <div className="space-y-8">
          {/* Buy panel */}
          <Card>
            <CardHeader>
              <CardTitle>Trade {asset.ticker}</CardTitle>
              <CardDescription>Add this asset to your portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-4">
                <div className="text-3xl font-bold">{formatCurrency(asset.price)}</div>
                <div className={`flex items-center justify-center gap-1 mt-1 ${isPriceUp ? 'text-success' : 'text-destructive'}`}>
                  {isPriceUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span>
                    {isPriceUp ? '+' : ''}{formatPercentage(asset.priceChangePercentage)} today
                  </span>
                </div>
              </div>
              
              {portfolios.length > 0 ? (
                <Button 
                  className="w-full gap-2" 
                  onClick={() => setIsTransactionDialogOpen(true)}
                >
                  <PlusCircle className="h-4 w-4" /> Buy Now
                </Button>
              ) : (
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">You need to create a portfolio first</p>
                  <Link to="/portfolios/create">
                    <Button>Create Portfolio</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Key Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Key Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {asset.type === 'stock' ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Market Cap</span>
                    <span>{formatCurrency(asset.price * 1000000)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">P/E Ratio</span>
                    <span>{(Math.random() * 30 + 5).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Dividend Yield</span>
                    <span>{(Math.random() * 5).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">52-Week High</span>
                    <span>{formatCurrency(asset.price * 1.2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">52-Week Low</span>
                    <span>{formatCurrency(asset.price * 0.8)}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Market Cap</span>
                    <span>{formatCurrency(asset.price * 1000000)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Volume (24h)</span>
                    <span>{formatCurrency(asset.price * 500000)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Circulating Supply</span>
                    <span>{(1000000).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">All-Time High</span>
                    <span>{formatCurrency(asset.price * 1.5)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">All-Time Low</span>
                    <span>{formatCurrency(asset.price * 0.5)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;
