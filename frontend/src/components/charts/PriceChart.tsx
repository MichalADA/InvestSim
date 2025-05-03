
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { PriceHistory, Timeframe } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface PriceChartProps {
  data?: PriceHistory;
  isLoading?: boolean;
  height?: number;
  showGrid?: boolean;
  showAxis?: boolean;
  className?: string;
}

export function PriceChart({
  data,
  isLoading = false,
  height = 350,
  showGrid = true,
  showAxis = true,
  className,
}: PriceChartProps) {
  // Display reference price line for comparison (usually opening price)
  const referencePriceValue = data?.data?.[0]?.value || 0;
  
  // Get color based on price trend
  const getChartColor = () => {
    if (!data?.data || data.data.length < 2) return '#0c98eb'; // Default blue
    const firstPrice = data.data[0].value;
    const lastPrice = data.data[data.data.length - 1].value;
    return lastPrice >= firstPrice ? '#22c55e' : '#ef4444';
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded shadow text-sm">
          <p className="font-semibold">{label}</p>
          <p className="text-foreground">
            {formatCurrency(payload[0].value)}
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
          {data?.data && data.data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.data}
                margin={{ top: 10, right: 10, bottom: 10, left: showAxis ? 50 : 0 }}
              >
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />}
                {showAxis && (
                  <>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                      stroke="rgba(0,0,0,0.2)"
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                      stroke="rgba(0,0,0,0.2)"
                      tickFormatter={(value) => formatCurrency(value, 'USD', 0)}
                      domain={['dataMin - 1%', 'dataMax + 1%']}
                    />
                  </>
                )}
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={referencePriceValue}
                  stroke="rgba(0,0,0,0.2)"
                  strokeDasharray="3 3"
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={getChartColor()}
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
