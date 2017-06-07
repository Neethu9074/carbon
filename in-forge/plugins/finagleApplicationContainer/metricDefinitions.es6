import { siPrefixPerSecond, siPrefix } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

const metricDefinitions = [
  {
    metric: getMetricMatch('metrics', 'gauges'),
    label(snapshot, metricMatch) {
      return metricMatch[1];
    },
    formatter: siPrefix
  },
  {
    metric: getMetricMatch('metrics', 'counters'),
    label(snapshot, metricMatch) {
      return metricMatch[1];
    },
    min: 0,
    formatter: siPrefix
  }
];

export default metricDefinitions;
