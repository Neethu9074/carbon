import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    label: 'Frontend Requests',
    metric: getMetricMatch('frontendStats', 'reqRate')
  },
  {
    label: 'Frontend Sessions',
    metric: getMetricMatch('frontendStats', 'sessionRate')
  }
];
