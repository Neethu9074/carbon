/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { AggregationType } from '@instana/types';

import { MonitoringSource } from 'in-custom-dashboards/widgets/SloLegacy/constants';
import { deepFreeze } from 'in-services/util/object';
import { t } from 'in-i18n';

export const timeAggregationOptions = deepFreeze([
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
] as const);

export const sumAggregation = deepFreeze([
  { value: 'SUM', label: t('in-custom-dashboards:widgets.slo.metricFormData.sum') }
] as const);

export const meanAggregation = deepFreeze([
  { value: 'MEAN', label: t('in-custom-dashboards:widgets.slo.metricFormData.mean') }
] as const);

interface AggregationOption {
  readonly value: AggregationType;
  readonly label: string;
}

export interface MetricOption<S extends MonitoringSource, E extends MetricEntityType<S>> {
  readonly name: MetricType<S, E>;
  readonly options: AggregationOption[];
  readonly defaultValue: AggregationType;
  readonly label: string;
  readonly unitLabel: string;
  readonly type: 'rate' | 'count';
}
export type MetricOptions<S extends MonitoringSource, E extends MetricEntityType<S>> = Record<
  MetricType<S, E>,
  MetricOption<S, E>
>;

export type MetricEntityType<S extends MonitoringSource> = keyof (typeof metricOptions)[S];
export type MetricType<S extends MonitoringSource, E extends MetricEntityType<S>> = keyof (typeof metricOptions)[S][E];

const metricOptions = deepFreeze({
  application: {
    calls: {
      latency: {
        name: 'latency',
        options: timeAggregationOptions,
        defaultValue: 'P90',
        label: t('in-custom-dashboards:widgets.slo.metricFormData.latency'),
        unitLabel: t('in-custom-dashboards:widgets.slo.metricsForm.thresholdMs'),
        type: 'count'
      },
      calls: {
        name: 'calls',
        options: sumAggregation,
        defaultValue: 'SUM',
        label: t('in-custom-dashboards:widgets.slo.metricFormData.callCount'),
        unitLabel: t('in-custom-dashboards:widgets.slo.metricsForm.thresholdCount'),
        type: 'count'
      },
      erroneousCalls: {
        name: 'erroneousCalls',
        options: sumAggregation,
        defaultValue: 'SUM',
        label: t('in-custom-dashboards:widgets.slo.metricFormData.erroneousCalls'),
        unitLabel: t('in-custom-dashboards:widgets.slo.metricsForm.thresholdCount'),
        type: 'count'
      },
      errors: {
        name: 'errors',
        options: meanAggregation,
        defaultValue: 'MEAN',
        label: t('in-custom-dashboards:widgets.slo.metricFormData.errorRate'),
        unitLabel: t('in-custom-dashboards:widgets.slo.metricsForm.thresholdPercent'),
        type: 'rate'
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
        unitLabel: t('in-custom-dashboards:widgets.slo.metricsForm.thresholdPercent'),
        type: 'rate'
      },
      beaconDuration: {
        name: 'beaconDuration',
        options: timeAggregationOptions,
        defaultValue: 'P90',
        label: t('in-custom-dashboards:widgets.slo.metricFormData.beaconDuration'),
        unitLabel: t('in-custom-dashboards:widgets.slo.metricsForm.thresholdMs'),
        type: 'count'
      }
    }
  }
} as const);

export function getDefaultMetricEntityType<S extends MonitoringSource>(entityType: S): MetricEntityType<S> {
  return Object.keys(metricOptions[entityType])[0] as MetricEntityType<S>;
}

export function getMetricOptions<S extends MonitoringSource, E extends MetricEntityType<S>>(
  entityType: S,
  metricEntityType: E
): MetricOptions<S, E> {
  return metricOptions[entityType][metricEntityType];
}
