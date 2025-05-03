
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Asset } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

interface AssetTableProps {
  assets: Asset[];
}

export function AssetTable({ assets }: AssetTableProps) {
  const navigate = useNavigate();

  const handleRowClick = (ticker: string) => {
    navigate(`/market/${ticker}`);
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Change</TableHead>
            <TableHead className="text-right">Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No assets available.
              </TableCell>
            </TableRow>
          )}
          {assets.map((asset) => (
            <TableRow 
              key={asset.id} 
              onClick={() => handleRowClick(asset.ticker)}
              className="cursor-pointer hover:bg-muted/40"
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{asset.icon}</span>
                  <div>
                    <p className="font-medium">{asset.ticker}</p>
                    <p className="text-sm text-muted-foreground">{asset.name}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(asset.price)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <span 
                    className={`${asset.priceChange >= 0 ? 'text-success' : 'text-destructive'}`}
                  >
                    {asset.priceChange >= 0 ? '+' : ''}{formatPercentage(asset.priceChangePercentage)}
                  </span>
                  {asset.priceChange >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-success" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-destructive" />
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-primary/10 text-primary">
                  {asset.type}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
