
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { PortfolioCard } from '@/components/portfolios/PortfolioCard';
import { usePortfolio } from '@/context/PortfolioContext';

const PortfoliosList = () => {
  const { portfolios, isLoading } = usePortfolio();

  return (
    <div>
      <PageHeader
        title="Your Portfolios"
        description="Manage your investment portfolios"
        action={
          <Link to="/portfolios/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Portfolio
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <div className="py-12 text-center">Loading portfolios...</div>
      ) : portfolios.length === 0 ? (
        <div className="py-12 text-center flex flex-col items-center">
          <p className="text-muted-foreground mb-6 max-w-md">
            You don't have any portfolios yet. Create your first portfolio to start investing.
          </p>
          <Link to="/portfolios/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Create Portfolio
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <PortfolioCard key={portfolio.id} portfolio={portfolio} />
          ))}
          <div className="flex items-center justify-center h-full min-h-[200px] border border-dashed rounded-lg hover:border-primary/50 transition-colors">
            <Link to="/portfolios/create" className="text-center p-6">
              <div className="mx-auto bg-muted/50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-medium mb-1">Create New Portfolio</p>
              <p className="text-sm text-muted-foreground">Add a new investment strategy</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfoliosList;
