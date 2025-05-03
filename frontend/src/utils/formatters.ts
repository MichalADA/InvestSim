
/**
 * Format a number as currency
 * @param value Number to format
 * @param currency Currency code
 * @param minimumFractionDigits Minimum number of fraction digits
 */
export const formatCurrency = (
  value: number,
  currency = 'USD',
  minimumFractionDigits = 2
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  }).format(value);
};

/**
 * Format a number as percentage
 * @param value Number to format
 * @param minimumFractionDigits Minimum number of fraction digits
 */
export const formatPercentage = (
  value: number,
  minimumFractionDigits = 2
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  }).format(value / 100);
};

/**
 * Format a number with commas
 * @param value Number to format
 * @param minimumFractionDigits Minimum number of fraction digits
 */
export const formatNumber = (
  value: number,
  minimumFractionDigits = 2
): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  }).format(value);
};

/**
 * Format a date
 * @param date Date to format
 * @param options Intl.DateTimeFormatOptions
 */
export const formatDate = (
  date: Date,
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }
): string => {
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

/**
 * Format a number as compact
 * @param value Number to format
 */
export const formatCompact = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
};
