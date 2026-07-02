/* =========================================================
   formatters.js — Display formatting utilities
   Currency, numbers, dates, and time
   ========================================================= */

/**
 * Format a number as Indian Rupees (₹).
 * e.g., 20000 → "₹20,000"
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number with comma separators.
 * e.g., 1600 → "1,600"
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('en-IN').format(num);
}

/**
 * Format a number as a compact string.
 * e.g., 1600 → "1.6K", 20000 → "20K"
 */
export function formatCompact(num) {
  if (num >= 100000) return (num / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
}

/**
 * Format a percentage.
 * e.g., 0.75 → "75%"
 */
export function formatPercentage(ratio, decimals = 0) {
  return (ratio * 100).toFixed(decimals) + '%';
}

/**
 * Format a timestamp as a relative time string.
 * e.g., "2 minutes ago", "1 hour ago", "Yesterday"
 */
export function formatRelativeTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Format a timestamp as a full date string.
 * e.g., "8 Jun 2026, 12:30 PM"
 */
export function formatDateTime(timestamp) {
  return new Date(timestamp).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format seconds into a human-readable duration.
 * e.g., 3661 → "1h 1m"
 */
export function formatDuration(seconds) {
  if (seconds === Infinity) return '∞';
  if (seconds < 60) return `${Math.ceil(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

/**
 * Generate a unique ID.
 */
export function generateId(prefix = '') {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
