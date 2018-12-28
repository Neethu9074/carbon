import { newTimeMetric } from 'in-analyze/metricDefinitionHelpers';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { percentage } from 'in-services/formatters/number';

export const defaultMetrics = {
  trace: [{ metric: 'latency', aggregation: 'MEAN' }, { metric: 'errors', aggregation: 'MEAN' }],
  call: [{ metric: 'latency', aggregation: 'MEAN' }, { metric: 'errors', aggregation: 'MEAN' }]
};

const latency = newTimeMetric('latency', 'Latency');
const errorRate = {
  metric: 'errors',
  label: 'Error Rate',
  formatter: percentage,
  supportedAggregations: ['MEAN'],
  preferredRenderer: Renderer.stackedBar,
  min: 0
};

export const availableMetrics = {
  trace: [latency, errorRate],
  call: [latency, errorRate]
};
