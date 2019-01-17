import { percentage, number, millis } from 'in-services/formatters/number';
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

const latency = {
  metric: 'latency',
  label: 'Latency',
  formatter: millis.forcedFixedCompact,
  supportedAggregations: ['MEAN', 'MAX'],
  min: 0,
  preferredRenderer: Renderer.stackedArea
};

export const availableMetrics = [latency, errorRate];
