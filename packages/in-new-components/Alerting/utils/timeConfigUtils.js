import { hoursToMillis, minutesToMillis } from 'in-new-components/Alerting/utils/formatUtils';

export const alertingDialogItemPickerTimeframe = hoursToMillis(7 * 24);
export const alertingEventDetailsChartTimeframe = hoursToMillis(12);

/**
 * View configuration for charts supporting to show the data in different time frames.
 * Remarks: Setting minChartMetricGranularity enables to use a coarser granularity when rendering the metric in
 *          the chart. However, this minimum granularity should NOT be used when requesting the baseline, threshold
 *          or the alerts-preview.
 */
export const chartViewConfigs = Object.freeze([
  {
    label: 'Last 24 hours',
    timeConfig: {
      windowSize: hoursToMillis(24)
    },
    minChartMetricGranularity: 0
  },
  {
    label: 'Last 7 days',
    timeConfig: {
      windowSize: hoursToMillis(7 * 24)
    },
    minChartMetricGranularity: minutesToMillis(10)
  }
]);

export function shouldSmoothMetric(windowSize) {
  return windowSize <= chartViewConfigs[0].timeConfig.windowSize;
}
