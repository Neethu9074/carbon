/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { percentage, bytes, number, millis } from 'in-services/formatters/number';
import { FormatterFn } from 'in-stores/metric/formatters';
import { t } from 'in-i18n';

export interface Metric {
  metric: string;
  label: string;
  formatter: FormatterFn;
  supportedAggregations: string[];
  min: number;
  category?: string;
  metricIdentifier?: string;
}

const totalTests = {
  metric: 'synthetic.testId',
  label: t('in-custom-dashboards:widgets.srcSyntheticMonitoring.formComponent.totalTests'),
  formatter: number.compact,
  supportedAggregations: ['DISTINCT_COUNT'],
  min: 0
};

const totalExecutions = {
  metric: 'synthetic.id',
  label: t('in-custom-dashboards:widgets.srcSyntheticMonitoring.formComponent.totalExecutions'),
  formatter: number.compact,
  supportedAggregations: ['DISTINCT_COUNT'],
  min: 0
};

const failureRate = {
  metric: 'synthetic.failureRate',
  label: t('in-custom-dashboards:widgets.srcSyntheticMonitoring.formComponent.failureRate'),
  formatter: percentage.detailed,
  supportedAggregations: ['MEAN'],
  min: 0
};

const successRate = {
  metric: 'synthetic.successRate',
  label: t('in-custom-dashboards:widgets.srcSyntheticMonitoring.formComponent.successRate'),
  formatter: percentage.detailed,
  supportedAggregations: ['MEAN'],
  min: 0
};

const responseTime = {
  metric: 'synthetic.metricsResponseTime',
  label: t('in-custom-dashboards:widgets.srcSyntheticMonitoring.formComponent.responseTime'),
  supportedAggregations: ['MEAN'],
  formatter: millis.forcedCompactOnMs.detailed,
  min: 0
};

const responseSize = {
  metric: 'synthetic.metricsResponseSize',
  label: t('in-custom-dashboards:widgets.srcSyntheticMonitoring.formComponent.responsesize'),
  supportedAggregations: ['MEAN'],
  formatter: bytes.detailed,
  min: 0
};

export const availableMetrics: Metric[] = [
  totalTests,
  totalExecutions,
  failureRate,
  successRate,
  responseTime,
  responseSize
];
