export const alertingDialogItemPickerTimeframe = 7 * 24 * 60 * 60 * 1000;
export const alertingEventDetailsChartTimeframe = 12 * 60 * 60 * 1000;
export const alertingDialogChartTimeframe = 24 * 60 * 60 * 1000;
export const alertingMetricsGranularity = 10 * 60 * 1000;

export const timeConfigs = Object.freeze([
  {
    label: 'Last 24 hours',
    windowSize: 24 * 60 * 60 * 1000,
    granularity: 10 * 60 * 1000
  },
  {
    label: 'Last 7 Days',
    windowSize: 7 * 24 * 60 * 60 * 1000,
    granularity: 6 * 60 * 60 * 1000
  }
]);

export function createTimeConfig(windowSize) {
  return {
    to: null,
    focusedMoment: null,
    windowSize,
    autoRefresh: false
  };
}
