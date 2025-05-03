
import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Asset } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

interface AssetCardProps {
  asset: Asset;
}

export function AssetCard({ asset }: AssetCardProps) {
  const isPriceUp = asset.priceChange >= 0;

  return (
    <Link to={`/market/${asset.ticker}`}>
      <Card className="h-full cursor-pointer hover:border-primary/50 transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center text-base">
            <div className="flex items-center gap-2">
              <span className="text-lg">{asset.icon}</span>
              <span>{asset.ticker}</span>
            </div>
            <div 
              className={`p-1 rounded-full ${
                isPriceUp ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
              }`}
            >
              {isPriceUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">{asset.name}</p>
          <div>
            <p className="text-xl font-bold">{formatCurrency(asset.price)}</p>
            <div className="flex items-center mt-1">
              <span 
                className={`text-sm font-medium ${
                  isPriceUp ? 'text-success' : 'text-destructive'
                }`}
              >
                {isPriceUp ? '+' : ''}{formatCurrency(asset.priceChange)}
                {' '}
                ({isPriceUp ? '+' : ''}{formatPercentage(asset.priceChangePercentage)})
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
