import { hoursToMillis, minutesToMillis } from 'in-new-components/Alerting/utils/formatUtils';

export const alertingDialogItemPickerTimeframe = hoursToMillis(7 * 24);
export const alertingEventDetailsChartTimeframe = hoursToMillis(12);
export const alertingDialogChartTimeframe = hoursToMillis(24);
export const alertingMetricsGranularity = minutesToMillis(10);

export const chartViewConfigs = Object.freeze([
  {
    label: 'Last 24 hours',
    windowSize: hoursToMillis(24),
    granularity: minutesToMillis(10)
  },
  {
    label: 'Last 7 Days',
    windowSize: hoursToMillis(7 * 24),
    granularity: minutesToMillis(10)
  }
]);

export function createTimeConfigForWindowSize(windowSize) {
  return {
    to: null,
    focusedMoment: null,
    windowSize,
    autoRefresh: false
  };
}

export function getIndexOfTimeConfig(timeConfig) {
  return chartViewConfigs.findIndex(tc => tc.windowSize === timeConfig?.windowSize);
}

export function shouldSmoothMetric(windowSize) {
  return windowSize <= chartViewConfigs[0].windowSize;
}
