import { getBlockSizeMillis } from 'in-services/util/dynamicAggregation';

const maximumNumberOfUsefulDataPoints = 60;

const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;
const sensibleGranularities = [
  second,
  5 * second,
  10 * second,
  minute,
  5 * minute,
  10 * minute,
  hour,
  5 * hour,
  10 * hour,
  day,
  5 * day,
  10 * day
];

export function getChartGranularity({ windowSize }) {
  const granularity = sensibleGranularities.find(
    granularity => granularity * maximumNumberOfUsefulDataPoints >= windowSize
  );
  return granularity || sensibleGranularities[sensibleGranularities.length - 1];
}

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
