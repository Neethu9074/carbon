/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { TimeConfig, UnifiedMetricConfigurationUnion } from '@instana/types';
import { t } from '@instana/i18n-react';

import { getFinestAvailableGranularity } from 'in-stores/metric/metric';
import { formatDurationAccurately } from 'in-services/formatters/date';

export function getTimeConfigBasedOnMetricConfiguration(
  metricConfig: UnifiedMetricConfigurationUnion,
  originalTimeConfig: TimeConfig
): TimeConfig {
  return metricConfig.lastValue
    ? {
        ...originalTimeConfig,
        windowSize: getFinestAvailableGranularity(originalTimeConfig, 10000)
      }
    : originalTimeConfig;
}

export function getLastValueTooltipLabel(originalTimeConfig: TimeConfig): string | undefined {
  if (!originalTimeConfig) {
    return undefined;
  }
  return `${t('in-custom-dashboards:widgets.time.lastValueTooltipLabel', {
    duration: formatDurationAccurately(getFinestAvailableGranularity(originalTimeConfig, 10000), 100)
  })}`;
}
