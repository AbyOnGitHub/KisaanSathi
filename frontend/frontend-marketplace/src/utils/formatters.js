/**
 * Utility functions for formatting prices in Indian Rupees, dates, and relative times.
 */

// Format numbers in Indian numbering format (e.g. ₹1,23,456 or ₹450)
export function formatPrice(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  const numericAmount = Math.round(Number(amount));
  return '₹' + numericAmount.toLocaleString('en-IN');
}

// Format full date (e.g. "Feb 5, 2024")
export function formatDate(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

// Format relative time (e.g. "2 hours ago", "Just now")
export function timeAgo(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(isoString);
  } catch {
    return isoString;
  }
}

// Generates an estimated delivery date string (e.g. "Wed, Feb 25")
export function getEstimatedDeliveryDate(daysOffset = 3) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

// Calculate discount percentage from MRP and selling price
export function calculateDiscount(sellingPrice, mrp) {
  if (!mrp || mrp <= sellingPrice) return 0;
  return Math.round(((mrp - sellingPrice) / mrp) * 100);
}
