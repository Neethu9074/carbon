import { siPrefix } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metric: getMetricMatch('metrics', 'counters'),
    label(snapshot, metricMatch) {
      return metricMatch[1];
    },
    formatter: siPrefix
  },
  {
    metric: getMetricMatch('metrics', 'gauges'),
    label(snapshot, metricMatch) {
      return metricMatch[1];
    },
    min: 0,
    formatter: siPrefix
  },
  {
    metric: getMetricMatch('metrics', 'histograms'),
    label(snapshot, metricMatch) {
      return metricMatch[1];
    },
    min: 0,
    formatter: siPrefix
  },
  {
    metric: getMetricMatch('metrics', 'summaries'),
    label(snapshot, metricMatch) {
      return metricMatch[1];
    },
    min: 0,
    formatter: siPrefix
  }
];
