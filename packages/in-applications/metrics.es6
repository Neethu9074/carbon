import { getBlockSizeMillis } from 'in-services/util/dynamicAggregation';

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
