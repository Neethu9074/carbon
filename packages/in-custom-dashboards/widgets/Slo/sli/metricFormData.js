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

const metricOptions = Object.freeze({
  application: {
    calls: {
      latency: {
        name: 'latency',
        options: timeAggregationOptions,
        defaultValue: 'P90',
        label: t('in-custom-dashboards:widgets.slo.metricFormData.latency'),
        unitLabel: t('in-custom-dashboards:widgets.slo.metricsForm.thresholdMs')
      },
      calls: {
        name: 'calls',
        options: sumAggregation,
        defaultValue: 'SUM',
        label: t('in-custom-dashboards:widgets.slo.metricFormData.callCount'),
        unitLabel: t('in-custom-dashboards:widgets.slo.metricsForm.thresholdCount')
      },
      erroneousCalls: {
        name: 'erroneousCalls',
        options: sumAggregation,
        defaultValue: 'SUM',
        label: t('in-custom-dashboards:widgets.slo.metricFormData.erroneousCalls'),
        unitLabel: t('in-custom-dashboards:widgets.slo.metricsForm.thresholdCount')
      },
      errors: {
        name: 'errors',
        options: meanAggregation,
        defaultValue: 'MEAN',
        label: t('in-custom-dashboards:widgets.slo.metricFormData.errorRate'),
        unitLabel: t('in-custom-dashboards:widgets.slo.metricsForm.thresholdPercent')
      }
    }
  },
  website: {
    httpRequest: {
      beaconErrorRate: {
        name: 'beaconErrorRate',
        options: meanAggregation,
        defaultValue: 'MEAN',
        label: t('in-custom-dashboards:widgets.slo.metricFormData.beaconErrorRate'),
        unitLabel: t('in-custom-dashboards:widgets.slo.metricsForm.thresholdPercent')
      },
      beaconDuration: {
        name: 'beaconDuration',
        options: timeAggregationOptions,
        defaultValue: 'P90',
        label: t('in-custom-dashboards:widgets.slo.metricFormData.beaconDuration'),
        unitLabel: t('in-custom-dashboards:widgets.slo.metricsForm.thresholdMs')
      }
    }
  }
});

export function getMetricOptions(entityType, metricEntityType = 'calls') {
  return metricOptions[entityType][metricEntityType];
}
