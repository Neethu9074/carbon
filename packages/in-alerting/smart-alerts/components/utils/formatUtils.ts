/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function round(value: number | string, decimals: number): number {
  return parseFloat(Number.parseFloat(`${value}`).toPrecision(decimals));
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
