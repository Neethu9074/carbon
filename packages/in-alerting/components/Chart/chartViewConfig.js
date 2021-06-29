/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';

import { propTypeTimeConfig } from 'in-stores/time/config';
import { days } from 'in-services/time';
import { t } from 'in-i18n';

export const chartViewConfigPropType = PropTypes.shape({
  label: PropTypes.string,
  timeConfig: propTypeTimeConfig.isRequired,
  minChartMetricGranularity: PropTypes.number.isRequired,
  smoothMetric: PropTypes.bool
});

/**
 * View configuration for charts supporting to show the data in different time frames.
 * Remarks: Setting minChartMetricGranularity enables to use a coarser granularity when rendering the metric in
 *          the chart. However, this minimum granularity should NOT be used when requesting the baseline, threshold
 *          or the alerts-preview.
 */
export const chartViewConfigs = Object.freeze([
  {
    label: t('in-alerting:components.chart.chartViewConfigsLast24Hours'),
    timeConfig: {
      windowSize: days.toMillis(1)
    },
    minChartMetricGranularity: 0
  },
  {
    label: t('in-alerting:components.chart.chartViewConfigsLast7Days'),
    timeConfig: {
      windowSize: days.toMillis(7)
    },
    minChartMetricGranularity: 0, // at the moment we don't use a higher granularity for the metric, because we don't handle that properly for count metrics (using SUM)
    smoothMetric: true
  }
]);

export function createDefaultChartConfig(timeConfig) {
  return {
    timeConfig,
    minChartMetricGranularity: 0
  };
}
