/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { AdjustedTimeframe, TimeConfig, UnifiedMetricConfigurationUnion } from '@instana/types';
import { t } from '@instana/i18n-react';

import { formatDurationAccurately } from 'in-services/formatters/date';

export function getTimeConfigBasedOnMetricConfiguration(
  metricConfig: UnifiedMetricConfigurationUnion,
  originalTimeConfig: TimeConfig
): TimeConfig {
  return metricConfig.lastValue
    ? {
        ...originalTimeConfig,
        windowSize: 10000
      }
    : originalTimeConfig;
}

export function getLastValueTooltipLabel(adjustedTimeFrame: AdjustedTimeframe): string | undefined {
  if (!adjustedTimeFrame) {
    return undefined;
  }
  return `${t('in-custom-dashboards:widgets.time.lastValueTooltipLabel', {
    duration: formatDurationAccurately(adjustedTimeFrame.windowSize, 100)
  })}`;
}
