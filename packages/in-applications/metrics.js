import { assign, merge } from 'lodash';

import { animationDuration as globalAnimationDuration, wiggleRoom } from 'in-components/Chart/Configuration';
import { getBlockSizeMillis } from 'in-services/util/dynamicAggregation';
import { sensibleGranularities } from 'in-stores/metric/metric';

const maximumNumberOfUsefulDataPoints = 80;

export function getChartGranularity({ windowSize }) {
  const granularity = sensibleGranularities.find(
    granularity => windowSize / granularity <= maximumNumberOfUsefulDataPoints
  );
  return granularity || sensibleGranularities[sensibleGranularities.length - 1];
}

/*
 * Returns a normalized timeConfig where "to" is set to result.time (unless it is already set and equal to result.time,
 * in which case timeConfig is returned unmodified). Instead of a result object with an attribute "time" you can also
 * pass in a number (millis since epoch) directly.
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
    minPixelsPerBlock: 25,
    width: 300
  });
}

export function extendMetricConfigurationOnLiveMode(metricsConfiguration) {
  const timeConfig = metricsConfiguration.filter.timeConfig;
  if (!timeConfig.autoRefresh) {
    return metricsConfiguration;
  }

  return merge({}, metricsConfiguration, {
    filter: { timeConfig: extendWindowSizeOnLiveMode(metricsConfiguration.filter.timeConfig) }
  });
}

export function extendWindowSizeOnLiveMode(timeConfig) {
  if (!timeConfig.autoRefresh) {
    return timeConfig;
  }

  const granularity = getChartGranularity(timeConfig);
  const modifiedTimeConfig = assign({}, timeConfig);
  const animationDuration = timeConfig.autoRefresh ? globalAnimationDuration : 0;
  modifiedTimeConfig.windowSize += wiggleRoom + 2 * Math.max(animationDuration, granularity);
  return modifiedTimeConfig;
}
