/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// @ts-expect-error needs ts migration
import { fastQueryModeEnabledParameter } from 'in-custom-dashboards/navigation/url';
import { hasApplicationMetrics } from 'in-custom-dashboards/widgets/_shared/hasApplicationMetrics';
import { customDashboardsFastQueryModeEnabled } from 'in-services/featureFlags';
import { AxisConfiguration, ChartConfig } from 'in-components/Chart/types';
import { Nullish, UnifiedMetricConfigurationUnion } from 'in-types';
import useUrlState from 'in-hooks/useUrlState';

export const useFastQueryConfig = (config: any, type: string) => {
  const [{ fastQueryModeEnabled }] = useUrlState({
    bind: [fastQueryModeEnabledParameter]
  });

  // currently we only can/need to enable fast query mode to application-based widgets.
  if (!customDashboardsFastQueryModeEnabled || !hasApplicationMetrics(config)) return config;

  // change config based on widget type
  let newConfig = config;
  switch (type) {
    case 'pie':
    case 'chart':
      newConfig = {
        ...newConfig,
        y1: modifyChartConfig(newConfig.y1, fastQueryModeEnabled),
        y2: modifyChartConfig(newConfig.y2, fastQueryModeEnabled)
      } as ChartConfig;
      break;
    case 'histogram':
    case 'bigNumber':
    case 'topList':
      newConfig = {
        ...newConfig,
        metricConfiguration: modifyNonChartConfig(newConfig.metricConfiguration, fastQueryModeEnabled)
      };
      break;
    default:
      break;
  }

  return newConfig;
};

function modifyChartConfig(
  config: AxisConfiguration | Nullish,
  fastQueryModeEnabled: boolean
): AxisConfiguration | Nullish {
  if (!config) {
    return config;
  }

  return {
    ...config,
    // metrics are of type MetricDataPoint which does not include source for some reason...
    metrics: config.metrics.map((metric: any) =>
      metric.source === 'APPLICATION'
        ? {
            ...metric,
            queryPrecision: getQueryPrecision(fastQueryModeEnabled)
          }
        : metric
    )
  };
}

function modifyNonChartConfig(
  metricConfiguration: UnifiedMetricConfigurationUnion | Nullish,
  fastQueryModeEnabled: boolean
): UnifiedMetricConfigurationUnion | Nullish {
  return metricConfiguration?.source === 'APPLICATION'
    ? {
        ...metricConfiguration,
        queryPrecision: getQueryPrecision(fastQueryModeEnabled)
      }
    : metricConfiguration;
}

function getQueryPrecision(fastQueryModeEnabled: boolean): 'APPROXIMATE' | 'FULL' {
  return fastQueryModeEnabled ? 'APPROXIMATE' : 'FULL';
}
