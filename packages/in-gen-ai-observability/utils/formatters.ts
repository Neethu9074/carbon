/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { scale } from 'in-services/formatters/number';

/**
 * Helper to create a formatter that also supports rendering the currency symbol.
 * Similar to the one in oTelLLM plugin.
 */
export const formatCost = (value: string | number, currency = 'USD') => {
  try {
    const locale = navigator.language || 'en-US';
    const numberFormat = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      currencyDisplay: 'symbol',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: false
    });
    return numberFormat.format(0).replace(/\d+/g, value.toString()).trim();
  } catch {
    return `${value}`;
  }
};

// Export formatters that can be used in different components
export const cost = {
  compact: (d: number) => formatCost(scale.compact(d)),
  detailed: (d: number) => formatCost(scale.detailed(d))
};
