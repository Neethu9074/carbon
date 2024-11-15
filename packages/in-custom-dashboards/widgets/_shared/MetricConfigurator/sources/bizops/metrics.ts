/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// @ts-expect-error needs migration
import { newTimeMetric, wrapToDiscardNegativeValues } from 'in-analyze/metricDefinitionHelpers';
import { number, percentage } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { FormatterFn } from 'in-stores/metric/formatters';
import { t } from 'in-i18n';

export interface BizOpsMetric {
  metric: string;
  label: string;
  formatter: FormatterFn;
  supportedAggregations: string[];
  min: number;
  category?: string;
}

const activities_count = {
  metric: 'call_count',
  label: t('in-bizops:customDashboards.activityCountMetric'),
  formatter: wrapToDiscardNegativeValues(number.forcedCompact),
  supportedAggregations: ['SUM'],
  min: 0,
  preferredRenderer: Renderer.stackedBar,
  unfoldAggregations: false
};

const errorRate = {
  metric: 'errors',
  label: t('in-bizops:customDashboards.erroneousActivityCallsRateLabel'),
  formatter: percentage,
  supportedAggregations: ['MEAN'],
  preferredRenderer: Renderer.stackedBar,
  min: 0,
  category: t('in-bizops:customDashboards.erroneousActivityCallsCategory')
};

const erroneousCalls = {
  metric: 'erroneousCalls',
  label: t('in-bizops:customDashboards.erroneousActivityCallsCountLabel'),
  category: t('in-bizops:customDashboards.erroneousActivityCallsCategory'),
  formatter: wrapToDiscardNegativeValues(number.forcedCompact),
  supportedAggregations: ['SUM', 'PER_SECOND'],
  min: 0,
  preferredRenderer: Renderer.stackedBar,
  unfoldAggregations: false
};

const latency = {
  ...newTimeMetric({
    metric: 'latency',
    label: t('in-bizops:customDashboards.latency'),
    category: t('in-bizops:customDashboards.latency')
  }),
  unfoldAggregations: true
};

export const availableMetrics: BizOpsMetric[] = [activities_count, erroneousCalls, errorRate, latency];
