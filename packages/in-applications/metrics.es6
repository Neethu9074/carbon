import { getBlockSizeMillis } from 'in-services/util/dynamicAggregation';
import { getDefaultMetricRollupDuration } from 'in-stores/metric';

export function getResolvedTimeframe(timeframe, result) {
  if (timeframe.to === result.time) {
    return timeframe;
  }
  return {
    to: result.time,
    windowSize: timeframe.windowSize
  };
}

export function getSparkChartGranularity(timeframe) {
  return getBlockSizeMillis({
    windowSize: timeframe.windowSize,
    minPixelsPerBlock: 30,
    width: 300
  });
}

export function getChartGranularity(timeframe, minRollup = 1000) {
  return getDefaultMetricRollupDuration(timeframe, minRollup).rollup || 1000;
}
