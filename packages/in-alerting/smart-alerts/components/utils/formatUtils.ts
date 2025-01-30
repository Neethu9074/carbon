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

export function getValueRoundedToDecimals(value: number | null, percentageMetric: boolean, roundTo?: number) {
  if (value == null) {
    return value;
  }

  return percentageMetric ? round(value * 100, roundTo ?? 3) : value;
}

export function getThresholdValueForPercentageMetric(value: number | null, percentageMetric: boolean) {
  if (value == null) {
    return value;
  }

  return percentageMetric ? round(value / 100, 3) : value;
}
