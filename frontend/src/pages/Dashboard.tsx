
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, TrendingDown, ArrowRight, Wallet, LineChart, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { DataCard } from '@/components/ui/data-card';
import { PriceChart } from '@/components/charts/PriceChart';
import { AssetCard } from '@/components/market/AssetCard';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { useAuth } from '@/context/AuthContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { useMarket } from '@/context/MarketContext';
import { Timeframe, Asset } from '@/types';

const Dashboard = () => {
  const { user } = useAuth();
  const { portfolios, isLoading: portfoliosLoading } = usePortfolio();
  const { marketOverview, getPriceHistory } = useMarket();
  const [indexChart, setIndexChart] = useState<any>(null);
  const [isChartLoading, setIsChartLoading] = useState(true);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        // Use the first available market asset for the chart
        if (marketOverview.trending.length > 0) {
          const data = await getPriceHistory(marketOverview.trending[0].ticker, Timeframe.MONTH);
          setIndexChart(data);
        }
      } catch (error) {
        console.error('Failed to load chart data:', error);
      } finally {
        setIsChartLoading(false);
      }
    };

    loadChartData();
  }, [marketOverview.trending, getPriceHistory]);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'Investor'}`}
        description="Here's an overview of your investments"
      />

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DataCard
          title="Total Portfolio Value"
          value={formatCurrency(user?.totalPortfolioValue || 0)}
          icon={<Wallet className="h-4 w-4" />}
          description="Across all portfolios"
        />
        <DataCard
          title="Total Profit/Loss"
          value={formatCurrency(user?.totalProfit || 0)}
          icon={user?.totalProfit && user?.totalProfit >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          trend={user?.totalProfit && user?.totalProfit >= 0 ? 'up' : 'down'}
          trendValue={formatPercentage(user?.totalProfitPercentage || 0)}
          description="All-time performance"
        />
        <DataCard
          title="Active Portfolios"
          value={portfolios.length}
          icon={<LineChart className="h-4 w-4" />}
          description="Click to manage"
          onClick={() => window.location.href = '/portfolios'}
        />
        <DataCard
          title="Total Assets"
          value={portfolios.reduce((total, portfolio) => total + portfolio.assets.length, 0)}
          icon={<BarChart2 className="h-4 w-4" />}
          description="Across all portfolios"
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Portfolio Summary */}
        <div className="lg:col-span-2 space-y-8">
          {/* Market Index Chart */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Market Overview</CardTitle>
                <Link to="/market">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View Market <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <CardDescription>30-day market trend</CardDescription>
            </CardHeader>
            <CardContent>
              <PriceChart 
                data={indexChart}
                isLoading={isChartLoading}
                height={300}
              />
            </CardContent>
          </Card>

          {/* Recent Portfolios */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Your Portfolios</CardTitle>
                <Link to="/portfolios">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <CardDescription>Summary of your investment portfolios</CardDescription>
            </CardHeader>
            <CardContent>
              {portfoliosLoading ? (
                <div className="py-8 text-center">Loading portfolios...</div>
              ) : portfolios.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {portfolios.slice(0, 2).map((portfolio) => (
                      <Link key={portfolio.id} to={`/portfolios/${portfolio.id}`}>
                        <Card className="hover:border-primary/50 transition-all">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">{portfolio.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Value</span>
                              <span className="font-medium">{formatCurrency(portfolio.currentValue)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Profit/Loss</span>
                              <span className={portfolio.profit >= 0 ? "text-success" : "text-destructive"}>
                                {formatCurrency(portfolio.profit)} ({formatPercentage(portfolio.profitPercentage)})
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Assets</span>
                              <span>{portfolio.assets.length}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                  
                  <Link to="/portfolios/create">
                    <Button variant="outline" className="w-full gap-2">
                      <Plus className="h-4 w-4" /> Create New Portfolio
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground mb-4">You don't have any portfolios yet</p>
                  <Link to="/portfolios/create">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" /> Create Your First Portfolio
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Market Data */}
        <div className="space-y-8">
          {/* Top Gainers */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Top Gainers</CardTitle>
              <CardDescription>Best performing assets today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {marketOverview.gainers.slice(0, 3).map((asset) => (
                <AssetMiniCard key={asset.id} asset={asset} />
              ))}
            </CardContent>
          </Card>

          {/* Top Losers */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Top Losers</CardTitle>
              <CardDescription>Worst performing assets today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {marketOverview.losers.slice(0, 3).map((asset) => (
                <AssetMiniCard key={asset.id} asset={asset} />
              ))}
            </CardContent>
          </Card>

          {/* Trending Assets */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Trending Assets</CardTitle>
              <CardDescription>Assets with high trading volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {marketOverview.trending.slice(0, 3).map((asset) => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Mini card component for assets in the sidebar
const AssetMiniCard = ({ asset }: { asset: Asset }) => {
  const isPriceUp = asset.priceChange >= 0;

  return (
    <Link to={`/market/${asset.ticker}`}>
      <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/30 transition-colors">
        <div className="flex items-center gap-2">
          <div className="text-xl">{asset.icon}</div>
          <div>
            <p className="font-medium">{asset.ticker}</p>
            <p className="text-xs text-muted-foreground">{asset.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-medium">{formatCurrency(asset.price)}</p>
          <p className={`text-xs ${isPriceUp ? 'text-success' : 'text-destructive'}`}>
            {isPriceUp ? '+' : ''}{formatPercentage(asset.priceChangePercentage)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Dashboard;
