export function round(value, decimals) {
  return parseFloat(Number.parseFloat(value).toPrecision(decimals));
}

export function getValueRoundedToDecimals(value, percentageMetric) {
  return percentageMetric ? round(value * 100, 3) : value;
}

export function getThresholdValueForPercentageMetric(value, percentageMetric) {
  return percentageMetric ? round(value / 100, 3) : value;
}
