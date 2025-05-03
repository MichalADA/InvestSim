
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Transaction, TransactionType } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface TransactionListProps {
  transactions: Transaction[];
  assets?: boolean;
}

export function TransactionList({ transactions, assets = false }: TransactionListProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            {assets && <TableHead>Asset</TableHead>}
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={assets ? 6 : 5} className="h-24 text-center">
                No transactions available.
              </TableCell>
            </TableRow>
          )}
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                {formatDate(transaction.timestamp, { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </TableCell>
              <TableCell>
                <div 
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                    ${transaction.type === TransactionType.BUY 
                      ? 'bg-success/10 text-success'
                      : 'bg-destructive/10 text-destructive'
                    }`}
                >
                  {transaction.type}
                </div>
              </TableCell>
              {assets && (
                <TableCell>
                  {transaction.asset ? (
                    <div className="flex items-center gap-1.5">
                      <span>{transaction.asset.ticker}</span>
                      <span className="text-muted-foreground text-xs">
                        ({transaction.asset.name})
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Unknown asset</span>
                  )}
                </TableCell>
              )}
              <TableCell className="text-right">{transaction.quantity}</TableCell>
              <TableCell className="text-right">{formatCurrency(transaction.price)}</TableCell>
              <TableCell className="text-right font-medium">{formatCurrency(transaction.totalAmount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
