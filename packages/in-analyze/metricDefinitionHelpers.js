/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { find } from 'lodash';

import { latencyFixed, bytes, number } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { emptyObject } from 'in-services/fixedObjects';

export function newTimeMetric({ metric, label, category }) {
  return {
    metric,
    label,
    formatter: wrapToDiscardNegativeValues(latencyFixed),
    supportedAggregations: ['MEAN', 'MIN', 'P25', 'P50', 'P75', 'P90', 'P95', 'P98', 'P99', 'MAX', 'SUM'],
    category,
    min: 0,
    preferredRenderer: Renderer.stackedArea,
    unfoldAggregations: false
  };
}

export function newSizeMetric({ metric, label, category }) {
  return {
    metric,
    label,
    formatter: wrapToDiscardNegativeValues(bytes),
    supportedAggregations: ['MEAN', 'MIN', 'P25', 'P50', 'P75', 'P90', 'P95', 'P98', 'P99', 'MAX', 'SUM'],
    category,
    min: 0,
    preferredRenderer: Renderer.stackedArea,
    unfoldAggregations: false
  };
}

export function newNumberMetric({ metric, label, category }) {
  return {
    metric,
    label,
    formatter: wrapToDiscardNegativeValues(number.forcedCompact),
    supportedAggregations: ['SUM'],
    category,
    min: 0,
    preferredRenderer: Renderer.stackedBar,
    unfoldAggregations: false
  };
}

export function newNumberWithDecimalsMetric({ metric, label, category, formatter = number.forcedDetailed }) {
  return {
    metric,
    label,
    formatter: wrapToDiscardNegativeValues(formatter),
    supportedAggregations: ['MEAN', 'MIN', 'P25', 'P50', 'P75', 'P90', 'P95', 'P98', 'P99', 'MAX', 'SUM'],
    category,
    min: 0,
    preferredRenderer: Renderer.stackedBar,
    unfoldAggregations: false
  };
}

export function withRawDataField(metricDefinition, opts = emptyObject) {
  metricDefinition.rawDataField = opts.rawDataField || metricDefinition.metric;
  metricDefinition.rawDataLabel = opts.rawDataLabel || metricDefinition.label;
  metricDefinition.rawDataFormatter = opts.rawDataFormatter || metricDefinition.formatter.detailed;
  metricDefinition.tag = opts.tag;
  return metricDefinition;
}

export function wrapToDiscardNegativeValues(formatter) {
  return {
    compact: v => (v < 0 || v == null ? 'N/A' : formatter.compact(v)),
    detailed: v => (v < 0 || v == null ? 'N/A' : formatter.detailed(v))
  };
}

export function getTag(availableMetrics, metric) {
  const definition = find(availableMetrics, m => m.metric === metric);
  return definition && definition.tag;
}
