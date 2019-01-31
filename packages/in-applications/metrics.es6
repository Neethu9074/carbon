import { getBlockSizeMillis } from 'in-services/util/dynamicAggregation';
import { assign } from 'lodash';

import { animationDuration, wiggleRoom } from 'in-components/Chart/Configuration';

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
    minPixelsPerBlock: 30,
    width: 300
  });
}

export function extendWebsiteMetricConfigurationOnLiveMode(metricsConfiguration) {
  const timeConfig = metricsConfiguration.timeConfig;
  if (!timeConfig.autoRefresh) {
    return metricsConfiguration;
  }

  return assign({}, metricsConfiguration, {
    timeConfig: extendWindowSizeOnLiveMode(metricsConfiguration.timeConfig)
  });
}

export function extendAppDataMetricConfigurationOnLiveMode(metricsConfiguration) {
  const timeConfig = metricsConfiguration.filter.timeConfig;
  if (!timeConfig.autoRefresh) {
    return metricsConfiguration;
  }

  return assign({}, metricsConfiguration, {
    filter: { timeConfig: extendWindowSizeOnLiveMode(metricsConfiguration.filter.timeConfig) }
  });
}

export function extendWindowSizeOnLiveMode(timeConfig) {
  if (!timeConfig.autoRefresh) {
    return timeConfig;
  }

  const granularity = getChartGranularity(timeConfig);
  const modifiedTimeConfig = assign({}, timeConfig);
  modifiedTimeConfig.windowSize += wiggleRoom + 2 * Math.max(animationDuration, granularity);
  return modifiedTimeConfig;
}
