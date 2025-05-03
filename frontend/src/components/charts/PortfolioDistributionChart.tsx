
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Portfolio, Asset } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { Skeleton } from '@/components/ui/skeleton';

interface PortfolioDistributionChartProps {
  portfolio?: Portfolio;
  isLoading?: boolean;
  height?: number;
  showLegend?: boolean;
  className?: string;
}

export function PortfolioDistributionChart({
  portfolio,
  isLoading = false,
  height = 300,
  showLegend = true,
  className,
}: PortfolioDistributionChartProps) {
  // Generate pie chart data from portfolio assets
  const chartData = useMemo(() => {
    if (!portfolio?.assets || portfolio.assets.length === 0) return [];
    
    return portfolio.assets.map((asset) => ({
      name: asset.ticker,
      value: asset.value || 0,
      asset,
    }));
  }, [portfolio]);

  // Generate colors for chart slices
  const COLORS = ['#0c98eb', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#0ea5e9', '#84cc16'];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const asset = data.asset as Asset;
      
      return (
        <div className="bg-background border border-border p-3 rounded shadow">
          <p className="font-semibold">{asset.name} ({asset.ticker})</p>
          <p>{formatCurrency(data.value)}</p>
          <p className="text-sm text-muted-foreground">
            {formatPercentage(data.value / (portfolio?.currentValue || 1) * 100)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={className}>
      {isLoading ? (
        <div className="w-full" style={{ height: `${height}px` }}>
          <Skeleton className="w-full h-full" />
        </div>
      ) : (
        <div className="w-full" style={{ height: `${height}px` }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius="80%"
                  innerRadius="40%"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                {showLegend && (
                  <Legend 
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    formatter={(value) => {
                      const asset = chartData.find(item => item.name === value)?.asset;
                      return asset ? `${asset.ticker} (${asset.name})` : value;
                    }}
                  />
                )}
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No assets in portfolio
            </div>
          )}
        </div>
      )}
    </div>
  );
}
