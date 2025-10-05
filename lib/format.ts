// lib/format.ts - Currency, date, and formatting utilities
import { z } from 'zod';

// Currency formatting
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCurrencyCompact(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    notation: 'compact',
  }).format(amount);
}

// Date formatting
export function formatDate(date: Date | string, options?: {
  format?: 'short' | 'medium' | 'long' | 'full';
  includeTime?: boolean;
  timeZone?: string;
}): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const formatOptions: Intl.DateTimeFormatOptions = {
    ...(options?.format === 'short' && {
      month: 'short',
      day: 'numeric',
    }),
    ...(options?.format === 'medium' && {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    ...(options?.format === 'long' && {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    ...(options?.format === 'full' && {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    ...(options?.includeTime && {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
  };
  
  if (options?.timeZone) {
    formatOptions.timeZone = options.timeZone;
  }
  
  return new Intl.DateTimeFormat('en-US', formatOptions).format(dateObj);
}

export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks === 1 ? '' : 's'} ago`;
  }
  
  return formatDate(dateObj, { format: 'medium' });
}

// Number formatting
export function formatNumber(num: number, options?: {
  decimals?: number;
  compact?: boolean;
  percentage?: boolean;
}): string {
  const formatOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: options?.decimals ?? 0,
    maximumFractionDigits: options?.decimals ?? 2,
    ...(options?.compact && { notation: 'compact' }),
    ...(options?.percentage && { style: 'percent' }),
  };
  
  return new Intl.NumberFormat('en-US', formatOptions).format(num);
}

// Dimension formatting
export function formatDimensions(width: number, height: number, unit: 'in' | 'ft' | 'cm' = 'in'): string {
  const unitSymbols = {
    in: '"',
    ft: "'",
    cm: 'cm',
  };
  
  const symbol = unitSymbols[unit];
  return `${width}${symbol} × ${height}${symbol}`;
}

export function formatSquareFeet(sqFt: number): string {
  return `${formatNumber(sqFt, { decimals: 2 })} sq ft`;
}

export function formatLinearFeet(lf: number): string {
  return `${formatNumber(lf, { decimals: 1 })} lf`;
}

// File size formatting
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${formatNumber(size, { decimals: unitIndex === 0 ? 0 : 1 })} ${units[unitIndex]}`;
}

// Phone number formatting
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone; // Return original if can't format
}

// Address formatting
export function formatAddress(address: {
  street: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
}): string {
  const { street, city, state, zip, country = 'US' } = address;
  return `${street}, ${city}, ${state} ${zip}${country !== 'US' ? `, ${country}` : ''}`;
}

// Order status formatting
export function formatOrderStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    in_production: 'In Production',
    qa: 'Quality Check',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  };
  
  return statusMap[status.toLowerCase()] || status;
}

// Progress percentage formatting
export function formatProgress(current: number, total: number): {
  percentage: number;
  formatted: string;
  isComplete: boolean;
} {
  const percentage = Math.round((current / total) * 100);
  const formatted = `${current}/${total} (${percentage}%)`;
  const isComplete = current >= total;
  
  return {
    percentage,
    formatted,
    isComplete,
  };
}

// Time duration formatting
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  
  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours < 24) {
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
}

// Validation helpers
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleaned = phone.replace(/\D/g, '');
  return phoneRegex.test(cleaned) && cleaned.length >= 10;
}

export function isValidZipCode(zip: string): boolean {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zip);
}

// Truncation
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.slice(0, maxLength - suffix.length) + suffix;
}

// Capitalization
export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function capitalizeWords(text: string): string {
  return text.split(' ').map(capitalizeFirst).join(' ');
}

export function toTitleCase(text: string): string {
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

// URL formatting
export function formatUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

// Slug generation
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Search highlighting
export function highlightSearchTerm(text: string, searchTerm: string, className: string = 'highlight'): string {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, `<span class="${className}">$1</span>`);
}
