import { newTimeMetric } from 'in-analyze/metricDefinitionHelpers';
import { percentage } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';

export const defaultMetrics = [{ metric: 'latency', aggregation: 'MEAN' }, { metric: 'errors' }];

const errorRate = {
  metric: 'errors',
  label: 'Error Rate',
  formatter: percentage,
  supportedAggregations: ['MEAN'],
  preferredRenderer: Renderer.stackedBar,
  min: 0
};

const latency = newTimeMetric({ metric: 'latency', label: 'Latency' });

export const availableMetrics = [latency, errorRate];
