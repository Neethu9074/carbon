/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

export const timeAggregationOptions = Object.freeze([
  { value: 'MEAN', label: t('in-custom-dashboards:widgets.slo.metricFormData.mean') },
  { value: 'MIN', label: t('in-custom-dashboards:widgets.slo.metricFormData.min') },
  { value: 'P25', label: t('in-custom-dashboards:widgets.slo.metricFormData.25th') },
  { value: 'P50', label: t('in-custom-dashboards:widgets.slo.metricFormData.50th') },
  { value: 'P75', label: t('in-custom-dashboards:widgets.slo.metricFormData.75th') },
  { value: 'P90', label: t('in-custom-dashboards:widgets.slo.metricFormData.90th') },
  { value: 'P95', label: t('in-custom-dashboards:widgets.slo.metricFormData.95th') },
  { value: 'P98', label: t('in-custom-dashboards:widgets.slo.metricFormData.98th') },
  { value: 'P99', label: t('in-custom-dashboards:widgets.slo.metricFormData.99th') },
  { value: 'MAX', label: t('in-custom-dashboards:widgets.slo.metricFormData.max') }
]);

export const sumAggregation = Object.freeze([
  { value: 'SUM', label: t('in-custom-dashboards:widgets.slo.metricFormData.sum') }
]);

export const meanAggregation = Object.freeze([
  { value: 'MEAN', label: t('in-custom-dashboards:widgets.slo.metricFormData.mean') }
]);

export const metricAggregations = Object.freeze({
  latency: { options: timeAggregationOptions, defaultValue: 'P90' },
  calls: { options: sumAggregation, defaultValue: 'SUM' },
  erroneousCalls: { options: sumAggregation, defaultValue: 'SUM' },
  errors: { options: meanAggregation, defaultValue: 'MEAN' }
});

export const metricOptions = Object.freeze([
  { value: 'latency', label: t('in-custom-dashboards:widgets.slo.metricFormData.latency') },
  { value: 'calls', label: t('in-custom-dashboards:widgets.slo.metricFormData.callCount') },
  { value: 'errors', label: t('in-custom-dashboards:widgets.slo.metricFormData.errorRate') },
  { value: 'erroneousCalls', label: t('in-custom-dashboards:widgets.slo.metricFormData.erroneousCalls') }
]);
