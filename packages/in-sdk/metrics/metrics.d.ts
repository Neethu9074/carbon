/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { NumberFormatter } from 'in-services/formatters/number';

export function hasCategory(plugin: string): boolean;

export function isBuiltInDynamicMetric(plugin: string, metricName: string): boolean;

export type DynamicMetricPattern = {
  pattern: RegExp;
  pre: string;
  post: string;
  placeholderLabel: string;
  defaultMatchingOperator: 'is' | 'contains' | 'startsWith' | 'endsWith' | 'any';
  lockedMatchingOperator: boolean;
};

interface MetricDefinition {
  label: string;
  metric: string | RegExp;
  metricPattern?: DynamicMetricPattern;
  getLabel: () => string;
  test: (metricName: string) => boolean;
  category: string[];
  hideInMetricSelector: false;
  getMin: () => number | undefined;
  getMax: () => number | undefined;
  formatter: NumberFormatter;
}

export function getMetricDefinition(plugin: string, metric: string): MetricDefinition;
