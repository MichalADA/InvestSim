
import React, { useState, useEffect } from 'react';
import { Calendar, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TransactionList } from '@/components/transactions/TransactionList';
import { usePortfolio } from '@/context/PortfolioContext';
import { useMarket } from '@/context/MarketContext';

const TransactionsList = () => {
  const { portfolios, getPortfolioTransactions } = usePortfolio();
  const { getAssetById } = useMarket();
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>('all');

  useEffect(() => {
    const loadTransactions = async () => {
      setIsLoading(true);
      
      try {
        let allTransactions: any[] = [];
        
        if (selectedPortfolioId === 'all') {
          // Load transactions from all portfolios
          for (const portfolio of portfolios) {
            const portfolioTransactions = await getPortfolioTransactions(portfolio.id);
            
            // Add portfolio information and asset information to each transaction
            const enhancedTransactions = portfolioTransactions.map(transaction => ({
              ...transaction,
              portfolioName: portfolio.name,
              asset: getAssetById(transaction.assetId),
            }));
            
            allTransactions = [...allTransactions, ...enhancedTransactions];
          }
        } else {
          // Load transactions from selected portfolio
          const portfolioTransactions = await getPortfolioTransactions(selectedPortfolioId);
          const portfolio = portfolios.find(p => p.id === selectedPortfolioId);
          
          // Add portfolio information and asset information to each transaction
          const enhancedTransactions = portfolioTransactions.map(transaction => ({
            ...transaction,
            portfolioName: portfolio?.name,
            asset: getAssetById(transaction.assetId),
          }));
          
          allTransactions = enhancedTransactions;
        }
        
        // Sort by date (newest first)
        allTransactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        setTransactions(allTransactions);
      } catch (error) {
        console.error('Failed to load transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (portfolios.length > 0) {
      loadTransactions();
    } else {
      setIsLoading(false);
    }
  }, [portfolios, selectedPortfolioId, getPortfolioTransactions, getAssetById]);

  return (
    <div>
      <PageHeader
        title="Transaction History"
        description="View all your investment transactions"
        action={
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Select 
            value={selectedPortfolioId} 
            onValueChange={setSelectedPortfolioId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select portfolio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Portfolios</SelectItem>
              {portfolios.map((portfolio) => (
                <SelectItem key={portfolio.id} value={portfolio.id}>
                  {portfolio.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" size="icon" className="w-10 h-10">
          <Calendar className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="icon" className="w-10 h-10">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Transaction list */}
      {isLoading ? (
        <div className="py-12 text-center">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No transactions found.</p>
        </div>
      ) : (
        <TransactionList transactions={transactions} assets />
      )}
    </div>
  );
};

export default TransactionsList;
