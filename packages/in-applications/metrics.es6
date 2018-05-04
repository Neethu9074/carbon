import { getBlockSizeMillis } from 'in-services/util/dynamicAggregation';

const maximumNumberOfUsefulDataPoints = 80;

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
    granularity => windowSize / granularity <= maximumNumberOfUsefulDataPoints
  );
  return granularity || sensibleGranularities[sensibleGranularities.length - 1];
}

/*
 * Returns a normalized timeConfig where "to" is set to result.time if not present in the original timeConfig.
 */
export function getResolvedTimeConfig(timeConfig, result) {
  let resultTime;
  if (typeof result === 'number') {
    resultTime = result;
  } else if (typeof result === 'object') {
    resultTime = result.time;
  }

  if (timeConfig.to === resultTime) {
    return timeConfig;
  }
  return {
    ...timeConfig,
    to: resultTime
  };
}

export function getSparkChartGranularity(timeConfig) {
  return getBlockSizeMillis({
    windowSize: timeConfig.windowSize,
    minPixelsPerBlock: 30,
    width: 300
  });
}
