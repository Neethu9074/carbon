import { millis, bytes, number } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';

export function newTimeMetric(metric, label, category) {
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

export function newSizeMetric(metric, label, category) {
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

export function newNumberMetric(metric, label, category) {
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
