import { millis, bytes, number } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { emptyObject } from 'in-services/fixedObjects';

export function newTimeMetric({ metric, label, category }) {
  return {
    metric,
    label,
    formatter: millis.forcedFixedCompact,
    supportedAggregations: ['MEAN', 'MIN', 'P25', 'P50', 'P75', 'P90', 'P95', 'P98', 'P99', 'MAX'],
    category,
    min: 0,
    preferredRenderer: Renderer.stackedArea
  };
}

export function newSizeMetric({ metric, label, category }) {
  return {
    metric,
    label,
    formatter: bytes,
    supportedAggregations: ['MEAN', 'MIN', 'P25', 'P50', 'P75', 'P90', 'P95', 'P98', 'P99', 'MAX'],
    category,
    min: 0,
    preferredRenderer: Renderer.stackedArea
  };
}

export function newNumberMetric({ metric, label, category }) {
  return {
    metric,
    label,
    formatter: number.forcedCompact,
    supportedAggregations: ['SUM'],
    category,
    min: 0,
    preferredRenderer: Renderer.stackedBar
  };
}

export function withRawDataField(metricDefinition, opts = emptyObject) {
  metricDefinition.rawDataField = opts.rawDataField || metricDefinition.metric;
  metricDefinition.rawDataLabel = opts.rawDataLabel || metricDefinition.label;
  metricDefinition.rawDataFormatter = opts.rawDataFormatter || metricDefinition.formatter;
  metricDefinition.tag = opts.tag;
  return metricDefinition;
}
