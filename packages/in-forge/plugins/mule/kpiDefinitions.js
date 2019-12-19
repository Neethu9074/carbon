import { millis } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    label: 'Average Processing Time (Applications)',
    metric: getMetricMatch('applications', 'avgProcessingTime'),
    formatter: millis.fixedCompact
  },
  {
    label: 'Average Processing TIme (Flows)',
    metric: getMetricMatch('flows', 'avgProcessingTime'),
    formatter: millis.fixedCompact
  }
];
