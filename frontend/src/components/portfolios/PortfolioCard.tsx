
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Portfolio } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

interface PortfolioCardProps {
  portfolio: Portfolio;
}

export function PortfolioCard({ portfolio }: PortfolioCardProps) {
  const isProfitable = portfolio.profit >= 0;
  const assetCount = portfolio.assets.length;

  return (
    <Link to={`/portfolios/${portfolio.id}`}>
      <Card className="h-full cursor-pointer hover:border-primary/50 transition-all">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{portfolio.name}</span>
            <div 
              className={`p-1.5 rounded-full ${
                isProfitable ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
              }`}
            >
              {isProfitable ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-2xl font-bold">{formatCurrency(portfolio.currentValue)}</p>
            <div className="flex items-center mt-1">
              <span 
                className={`text-sm font-medium ${
                  isProfitable ? 'text-success' : 'text-destructive'
                }`}
              >
                {isProfitable ? '+' : ''}{formatCurrency(portfolio.profit)}
                {' '}
                ({isProfitable ? '+' : ''}{formatPercentage(portfolio.profitPercentage)})
              </span>
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Initial: {formatCurrency(portfolio.initialInvestment)}</span>
            <span>{assetCount} {assetCount === 1 ? 'asset' : 'assets'}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
