/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function round(value: number | string, decimals: number): number {
  return parseFloat(Number.parseFloat(`${value}`).toPrecision(decimals));
}

export function getValueRoundedToDecimals(value: number, percentageMetric: boolean) {
  return percentageMetric ? round(value * 100, 3) : value;
}

export function getThresholdValueForPercentageMetric(value: number, percentageMetric: boolean) {
  return percentageMetric ? round(value / 100, 3) : value;
}
