/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { assign } from 'lodash';

import { extendWindowSizeOnLiveMode } from 'in-applications/metrics';

export {
  extendWindowSizeOnLiveMode,
  getChartGranularity,
  getResolvedTimeConfig,
  getSparkChartGranularity
} from 'in-applications/metrics';

export function extendMetricConfigurationOnLiveMode(metricsConfiguration) {
  const timeConfig = metricsConfiguration.timeConfig;
  if (!timeConfig.autoRefresh) {
    return metricsConfiguration;
  }

  return assign({}, metricsConfiguration, {
    timeConfig: extendWindowSizeOnLiveMode(metricsConfiguration.timeConfig)
  });
}
