export function formatPrice(price: number, currency: string = 'INR'): string {
  const symbols: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  const symbol = symbols[currency] || '';
  return `${symbol}${price.toLocaleString('en-IN')}`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return 'Date not set';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins > 0) return `${diffMins} min ago`;
  return 'Just now';
}

export function renderStars(rating: number, size: 'sm' | 'md' = 'sm'): string {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  const cls = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  return (
    '★'.repeat(full) +
    (hasHalf ? '⯨' : '') +
    '☆'.repeat(empty)
  ).replace(/./g, (c) => c);
}
