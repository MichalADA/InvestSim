
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Trash2, LineChart, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/ui/page-header';
import { DataCard } from '@/components/ui/data-card';
import { PortfolioDistributionChart } from '@/components/charts/PortfolioDistributionChart';
import { TransactionList } from '@/components/transactions/TransactionList';
import { usePortfolio } from '@/context/PortfolioContext';
import { useMarket } from '@/context/MarketContext';
import { AssetTable } from '@/components/market/AssetTable';
import { formatCurrency, formatPercentage, formatDate } from '@/utils/formatters';
import { TransactionType } from '@/types';
import { toast } from 'sonner';

const PortfolioDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { portfolios, selectedPortfolio, selectPortfolio, executeTransaction, getPortfolioTransactions, isLoading } = usePortfolio();
  const { marketAssets, getAssetById } = useMarket();
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  
  // Transaction form state
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.BUY);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    if (id) {
      selectPortfolio(id);
    }
  }, [id, selectPortfolio, portfolios]);

  useEffect(() => {
    const loadTransactions = async () => {
      if (id) {
        setTransactionsLoading(true);
        try {
          const data = await getPortfolioTransactions(id);
          
          // Enhance transactions with asset data
          const enhancedTransactions = data.map(transaction => ({
            ...transaction,
            asset: getAssetById(transaction.assetId),
          }));
          
          setTransactions(enhancedTransactions);
        } catch (error) {
          console.error('Failed to load transactions:', error);
        } finally {
          setTransactionsLoading(false);
        }
      }
    };
    
    loadTransactions();
  }, [id, getPortfolioTransactions, getAssetById]);

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPortfolio?.id || !selectedAssetId || !quantity) {
      toast.error('Please fill in all fields');
      return;
    }
    
    const asset = getAssetById(selectedAssetId);
    
    if (!asset) {
      toast.error('Selected asset not found');
      return;
    }
    
    const quantityValue = parseFloat(quantity);
    
    if (isNaN(quantityValue) || quantityValue <= 0) {
      toast.error('Quantity must be a positive number');
      return;
    }
    
    setIsExecuting(true);
    
    try {
      await executeTransaction(
        selectedPortfolio.id,
        selectedAssetId,
        transactionType,
        quantityValue,
        asset.price
      );
      
      // Update transactions list
      const newTransactions = await getPortfolioTransactions(selectedPortfolio.id);
      const enhancedTransactions = newTransactions.map(transaction => ({
        ...transaction,
        asset: getAssetById(transaction.assetId),
      }));
      setTransactions(enhancedTransactions);
      
      // Reset form
      setIsTransactionDialogOpen(false);
      setSelectedAssetId('');
      setQuantity('');
    } catch (error) {
      console.error('Transaction failed:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  // Filter assets for the sell option - only show assets in the portfolio
  const sellableAssets = selectedPortfolio?.assets || [];
  
  // For buy option, show all market assets
  const buyableAssets = marketAssets.filter(asset => 
    !selectedPortfolio?.assets.some(portfolioAsset => portfolioAsset.id === asset.id)
  );
  
  // Get the total by asset type
  const assetTypeDistribution = selectedPortfolio?.assets.reduce((acc, asset) => {
    acc[asset.type] = (acc[asset.type] || 0) + (asset.value || 0);
    return acc;
  }, {} as Record<string, number>) || {};

  if (isLoading) {
    return <div className="py-12 text-center">Loading portfolio details...</div>;
  }

  if (!selectedPortfolio) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground mb-4">Portfolio not found</p>
        <Link to="/portfolios">
          <Button>Back to Portfolios</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={selectedPortfolio.name}
        description={selectedPortfolio.description || 'Investment portfolio'}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/portfolios')} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" /> Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Transaction</DialogTitle>
                  <DialogDescription>
                    Buy or sell assets in your portfolio
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleTransactionSubmit}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Transaction Type</Label>
                      <Select 
                        value={transactionType} 
                        onValueChange={(value) => setTransactionType(value as TransactionType)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select transaction type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={TransactionType.BUY}>Buy</SelectItem>
                          <SelectItem value={TransactionType.SELL}>Sell</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="asset">Asset</Label>
                      <Select 
                        value={selectedAssetId} 
                        onValueChange={setSelectedAssetId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an asset" />
                        </SelectTrigger>
                        <SelectContent>
                          {transactionType === TransactionType.BUY 
                            ? buyableAssets.map(asset => (
                                <SelectItem key={asset.id} value={asset.id}>
                                  {asset.icon} {asset.ticker} - {asset.name}
                                </SelectItem>
                              ))
                            : sellableAssets.map(asset => (
                                <SelectItem key={asset.id} value={asset.id}>
                                  {asset.icon} {asset.ticker} - {asset.name} ({asset.quantity})
                                </SelectItem>
                              ))
                          }
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
                    
                    {selectedAssetId && (
                      <div className="text-sm bg-muted/50 p-3 rounded-md">
                        <p className="font-medium">Transaction Summary</p>
                        <div className="mt-2 space-y-1">
                          <p>
                            Asset: {getAssetById(selectedAssetId)?.name} ({getAssetById(selectedAssetId)?.ticker})
                          </p>
                          <p>
                            Price per unit: {formatCurrency(getAssetById(selectedAssetId)?.price || 0)}
                          </p>
                          {quantity && (
                            <p>
                              Total: {formatCurrency((getAssetById(selectedAssetId)?.price || 0) * parseFloat(quantity || '0'))}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isExecuting}>
                      {isExecuting ? 'Processing...' : 'Execute Transaction'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DataCard
          title="Current Value"
          value={formatCurrency(selectedPortfolio.currentValue)}
          icon={<Wallet className="h-4 w-4" />}
          description={`Initial: ${formatCurrency(selectedPortfolio.initialInvestment)}`}
        />
        <DataCard
          title="Profit/Loss"
          value={formatCurrency(selectedPortfolio.profit)}
          icon={selectedPortfolio.profit >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          trend={selectedPortfolio.profit >= 0 ? 'up' : 'down'}
          trendValue={formatPercentage(selectedPortfolio.profitPercentage)}
          description="All-time performance"
        />
        <DataCard
          title="Assets"
          value={selectedPortfolio.assets.length}
          icon={<LineChart className="h-4 w-4" />}
          description={`Created: ${formatDate(selectedPortfolio.createdAt)}`}
        />
        <DataCard
          title="Last Updated"
          value={formatDate(selectedPortfolio.updatedAt)}
          description="Portfolio last modified"
        />
      </div>

      {/* Portfolio Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Charts */}
        <div className="lg:col-span-1">
          <div className="space-y-8">
            <div className="bg-card rounded-lg border shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Portfolio Distribution</h3>
                <PortfolioDistributionChart portfolio={selectedPortfolio} height={300} />
              </div>
            </div>

            <div className="bg-card rounded-lg border shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Asset Types</h3>
                <div className="space-y-4">
                  {Object.entries(assetTypeDistribution).map(([type, value]) => (
                    <div key={type} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="capitalize">{type}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="font-medium">{formatCurrency(value)}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatPercentage(value / selectedPortfolio.currentValue * 100)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Assets & Transactions */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="assets">
            <TabsList className="mb-6">
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="assets">
              {selectedPortfolio.assets.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    This portfolio doesn't have any assets yet.
                  </p>
                  <Button onClick={() => setIsTransactionDialogOpen(true)}>Add First Asset</Button>
                </div>
              ) : (
                <AssetTable assets={selectedPortfolio.assets} />
              )}
            </TabsContent>
            
            <TabsContent value="transactions">
              {transactionsLoading ? (
                <div className="py-6 text-center">Loading transactions...</div>
              ) : (
                <TransactionList transactions={transactions} assets />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetail;
