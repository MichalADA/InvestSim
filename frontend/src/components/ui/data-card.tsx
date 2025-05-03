
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DataCardProps {
  title: string;
  value: React.ReactNode;
  description?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function DataCard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  className,
  onClick,
}: DataCardProps) {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all",
        onClick && "hover:border-primary/50 cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="opacity-70">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(trend || description) && (
          <div className="flex items-center mt-1">
            {trend && (
              <span
                className={cn(
                  "text-xs mr-2",
                  trend === 'up' && "text-success",
                  trend === 'down' && "text-destructive"
                )}
              >
                {trendValue}
              </span>
            )}
            {description && (
              <CardDescription className="text-xs mt-0">{description}</CardDescription>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
