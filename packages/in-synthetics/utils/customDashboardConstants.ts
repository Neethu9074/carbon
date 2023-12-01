/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { percentage, number, meanLatency, bytes } from 'in-services/formatters/number';
import { FormatterFn } from 'in-stores/metric/formatters';
import { t } from 'in-i18n';

export interface Metric {
  metric: string;
  label: string;
  formatter: FormatterFn;
  supportedAggregations: string[];
  min: number;
  category?: string;
}

const successRate = {
  metric: 'status',
  label: t('in-custom-dashboards:widgets.srcSyntheticMonitoring.formComponent.successRate'),
  formatter: percentage.detailed,
  supportedAggregations: ['MEAN'],
  min: 0
  //preferredRenderer: Renderer.stackedBar
};

const locations = {
  metric: 'location_id',
  label: t('in-custom-dashboards:widgets.srcSyntheticMonitoring.formComponent.locations'),
  formatter: number.compact,
  supportedAggregations: ['DISTINCT_COUNT'],
  min: 0
  //preferredRenderer: Renderer.stackedBar,
  //unfoldAggregations: false
};

const responseTime = {
  metric: 'response_time',
  label: t('in-custom-dashboards:widgets.srcSyntheticMonitoring.formComponent.responseTime'),
  supportedAggregations: ['MEAN', 'P90'],
  formatter: meanLatency.detailed,
  min: 0
  //preferredRenderer: Renderer.stackedBar,
  //unfoldAggregations: true
};

const responseSize = {
  metric: 'response_size',
  label: t('in-custom-dashboards:widgets.srcSyntheticMonitoring.formComponent.responsesize'),
  supportedAggregations: ['MEAN'],
  formatter: bytes.detailed,
  min: 0
  //preferredRenderer: Renderer.stackedBar,
  //unfoldAggregations: true
};

export const availableMetrics: Metric[] = [successRate, locations, responseTime, responseSize];
