import { newTimeMetric, newNumberMetric } from 'in-analyze/metricDefinitionHelpers';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { percentage } from 'in-services/formatters/number';

export const defaultMetrics = [{ metric: 'latency', aggregation: 'MEAN' }, { metric: 'errors', aggregation: 'MEAN' }];

const errorRate = {
  metric: 'errors',
  label: 'Erroneous Call Rate',
  formatter: percentage,
  supportedAggregations: ['MEAN'],
  preferredRenderer: Renderer.stackedBar,
  min: 0
};

const erroneousCalls = newNumberMetric({
  metric: 'erroneousCalls',
  label: 'Erroneous Calls'
});

const latency = newTimeMetric({ metric: 'latency', label: 'Latency' });

export const availableMetrics = [latency, erroneousCalls, errorRate];
