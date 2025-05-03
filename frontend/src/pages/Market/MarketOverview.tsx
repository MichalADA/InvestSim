
import React, { useState } from 'react';
import { SearchIcon, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/ui/page-header';
import { AssetTable } from '@/components/market/AssetTable';
import { AssetCard } from '@/components/market/AssetCard';
import { useMarket } from '@/context/MarketContext';
import { Asset, AssetType } from '@/types';

const MarketOverview = () => {
  const { marketAssets, marketOverview } = useMarket();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<AssetType | 'all'>('all');

  // Filter assets based on search query and selected type
  const filteredAssets = marketAssets.filter(asset => {
    const matchesSearch = searchQuery === '' || 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.ticker.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = activeFilter === 'all' || asset.type === activeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <PageHeader
        title="Market Overview"
        description="Explore and analyze market assets"
      />

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets by name or ticker..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Button
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('all')}
          >
            All
          </Button>
          <Button
            variant={activeFilter === AssetType.STOCK ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(AssetType.STOCK)}
          >
            Stocks
          </Button>
          <Button
            variant={activeFilter === AssetType.CRYPTO ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(AssetType.CRYPTO)}
          >
            Crypto
          </Button>
          <Button
            variant={activeFilter === AssetType.ETF ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(AssetType.ETF)}
          >
            ETFs
          </Button>
        </div>
      </div>

      {/* Market overview sections */}
      <div className="space-y-8">
        {/* Only show market highlights when not searching */}
        {searchQuery === '' && activeFilter === 'all' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Market Highlights</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <TrendingSection type="gainers" />
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {marketOverview.gainers.slice(0, 3).map((asset) => (
                    <AssetCard key={asset.id} asset={asset} />
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <TrendingSection type="losers" />
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {marketOverview.losers.slice(0, 3).map((asset) => (
                    <AssetCard key={asset.id} asset={asset} />
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <TrendingSection type="trending" />
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {marketOverview.trending.slice(0, 3).map((asset) => (
                    <AssetCard key={asset.id} asset={asset} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All assets section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {searchQuery || activeFilter !== 'all' 
                ? "Search Results" 
                : "All Assets"}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredAssets.length} assets
            </span>
          </div>

          <Tabs defaultValue="table">
            <div className="flex justify-end mb-4">
              <TabsList>
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="cards">Card View</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="table">
              {filteredAssets.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No assets found matching your search.</p>
                </div>
              ) : (
                <AssetTable assets={filteredAssets} />
              )}
            </TabsContent>
            
            <TabsContent value="cards">
              {filteredAssets.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No assets found matching your search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAssets.map((asset) => (
                    <AssetCard key={asset.id} asset={asset} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// Helper component for section titles
const TrendingSection = ({ type }: { type: 'gainers' | 'losers' | 'trending' }) => {
  let icon;
  let title;
  
  switch (type) {
    case 'gainers':
      icon = <span className="p-1 bg-success/10 text-success rounded"><ArrowUpDown className="h-4 w-4" /></span>;
      title = "Top Gainers";
      break;
    case 'losers':
      icon = <span className="p-1 bg-destructive/10 text-destructive rounded"><ArrowUpDown className="h-4 w-4 transform rotate-180" /></span>;
      title = "Top Losers";
      break;
    case 'trending':
      icon = <span className="p-1 bg-primary/10 text-primary rounded"><ArrowUpDown className="h-4 w-4" /></span>;
      title = "Trending";
      break;
  }
  
  return (
    <>
      {icon}
      <span>{title}</span>
    </>
  );
};

export default MarketOverview;
