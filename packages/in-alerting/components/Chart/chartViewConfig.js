/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';

import { propTypeTimeConfig } from 'in-stores/time/config';
import { hours } from 'in-services/time';
import { t } from 'in-i18n';

export const chartViewConfigPropType = PropTypes.shape({
  label: PropTypes.string,
  timeConfig: propTypeTimeConfig.isRequired,
  minChartMetricGranularity: PropTypes.number.isRequired,
  smoothMetric: PropTypes.bool
});

export const maxChartViewTimeframe = hours.toMillis(7 * 24);

/**
 * The timeConfig with the maximum timeframe that we support in our SmartAlerts chart.
 * This value is also relevant for other components within the SmartAlert-dialog, such as the entities-lists, in order
 * to have "stable values" when switching between these 24h and 7days view modes.
 * As a specific example, the user could otherwise deselect all entities in the S/E selector, but still see a metric
 * in the chart.
 */
export const maxChartViewTimeConfig = Object.freeze({
  windowSize: maxChartViewTimeframe
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
      windowSize: hours.toMillis(24)
    },
    minChartMetricGranularity: 0
  },
  {
    label: t('in-alerting:components.chart.chartViewConfigsLast7Days'),
    timeConfig: maxChartViewTimeConfig,
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
