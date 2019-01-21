import { newTimeMetric, withRawDataField } from 'in-analyze/metricDefinitionHelpers';
import { percentage, number } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';

export const defaultMetrics = [{ metric: 'latency', aggregation: 'MEAN' }, { metric: 'errors', aggregation: 'MEAN' }];

const errorRate = {
  metric: 'errors',
  label: 'Error Rate',
  formatter: percentage,
  supportedAggregations: ['MEAN'],
  preferredRenderer: Renderer.stackedBar,
  min: 0,
  rawDataField: 'errorCount',
  rawDataLabel: 'Error Count',
  rawDataFormatter: number.forcedCompact
};

const latency = withRawDataField(newTimeMetric({ metric: 'latency', label: 'Latency' }));

export const availableMetrics = [latency, errorRate];
