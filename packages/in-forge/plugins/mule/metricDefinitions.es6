import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, millis } from 'in-services/formatters/number';

export default [
  {
    metrics: [
      getMetricMatch('applications', 'processedEvents'),
      getMetricMatch('applications', 'executionErrors'),
      getMetricMatch('applications', 'fatalErrors'),
      getMetricMatch('flows', 'processedEvents'),
      getMetricMatch('flows', 'executionErrors'),
      getMetricMatch('flows', 'fatalErrors')
    ],
    labels: [
      'Processed Events',
      'Execution Errors',
      'Fatal Errors',
      'Processed Events',
      'Execution Errors',
      'Fatal Errors'
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [getMetricMatch('applications', 'avgProcessingTime'), getMetricMatch('flows', 'avgProcessingTime')],
    labels: ['Average Processing Time', 'Average Processing Time'],
    min: 0,
    formatter: millis.fixedCompact
  }
];
