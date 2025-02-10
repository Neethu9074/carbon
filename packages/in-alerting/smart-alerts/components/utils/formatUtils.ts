/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function round(value: number | string, decimals: number, fixed: boolean = false): number {
  const parsedValue = Number.parseFloat(`${value}`);

  if (fixed) {
    return parseFloat(parsedValue.toFixed(decimals));
  }

  return parseFloat(parsedValue.toPrecision(decimals));
}

export function getValueRoundedToDecimals(value: number | null, percentageMetric: boolean) {
  if (value == null) {
    return value;
  }

  return percentageMetric ? round(value * 100, 3) : value;
}

export function getThresholdValueForPercentageMetric(value: number | null, percentageMetric: boolean) {
  if (value == null) {
    return value;
  }

  return percentageMetric ? round(value / 100, 3) : value;
}

export function shiftDecimalRight(num: number, places: number = 2, percentageMetric: boolean) {
  if (num === null || num === 0 || !percentageMetric) return num;

  let [integer, decimal = ''] = num.toString().split('.');

  // Append necessary zeros if decimal part is shorter than places
  decimal = decimal.padEnd(places, '0');

  let shifted = integer + decimal.slice(0, places);
  let remaining = decimal.slice(places);

  return Number(shifted + (remaining ? '.' + remaining : ''));
}

export function shiftDecimalLeft(num: number, places: number = 2, percentageMetric: boolean) {
  if (num == null || num === 0 || !percentageMetric) {
    return num;
  }

  let str = num.toString();
  let [intPart, decPart = ''] = str.split('.');

  if (intPart.length <= places) {
    return '0.' + '0'.repeat(places - intPart.length) + intPart + decPart;
  }

  return intPart.slice(0, -places) + '.' + intPart.slice(-places) + decPart;
}
