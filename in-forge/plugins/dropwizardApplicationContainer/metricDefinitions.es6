import {
  siPrefixPerSecond,
  siPrefix
} from 'in-services/formatters/number';
import {getMetricMatch} from 'in-sdk/metrics/metricDefinitions';


export default [
  {
    metric: getMetricMatch('metrics\\.gauges'),
    label(snapshot, metricMatch) {
      // TODO: use correct labeling
      return metricMatch;
    },
    min: 0,
    formatter: siPrefix
  },
  {
    metric: getMetricMatch('metrics\\.counters'),
    label(snapshot, metricMatch) {
      // TODO: use correct labeling
      return metricMatch;
    },
    min: 0,
    formatter: siPrefix
  },
  {
    metric: getMetricMatch('metrics\\.meters'),
    label(snapshot, metricMatch) {
      // TODO: use correct labeling
      return metricMatch;
    },
    min: 0,
    formatter: siPrefixPerSecond
  }
];
