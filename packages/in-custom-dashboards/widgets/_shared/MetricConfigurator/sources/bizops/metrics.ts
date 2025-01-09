/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// @ts-expect-error needs migration
import { wrapToDiscardNegativeValues } from 'in-analyze/metricDefinitionHelpers';
import { latencyFixed, number, percentage } from 'in-services/formatters/number';
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

const activitiesCallCount = {
  metric: 'call_count',
  label: t('in-bizops:customDashboards.activityCountMetric'),
  formatter: wrapToDiscardNegativeValues(number.forcedCompact),
  supportedAggregations: ['SUM'],
  min: 0,
  preferredRenderer: Renderer.stackedBar,
  unfoldAggregations: false
};

const erroneousCalls = {
  metric: 'erroneous_call_count',
  label: t('in-bizops:customDashboards.erroneousActivityCallsCountLabel'),
  category: t('in-bizops:customDashboards.erroneousActivityCallsCategory'),
  formatter: wrapToDiscardNegativeValues(number.forcedCompact),
  supportedAggregations: ['SUM'],
  min: 0,
  preferredRenderer: Renderer.stackedBar,
  unfoldAggregations: false
};

const errorRate = {
  metric: 'erroneous_call_rate',
  label: t('in-bizops:customDashboards.erroneousActivityCallsRateLabel'),
  formatter: percentage,
  supportedAggregations: ['SUM'],
  preferredRenderer: Renderer.stackedBar,
  min: 0,
  category: t('in-bizops:customDashboards.erroneousActivityCallsCategory'),
  unfoldAggregations: false
};

const latency = {
  metric: 'call_latency',
  label: t('in-bizops:customDashboards.latency'),
  formatter: wrapToDiscardNegativeValues(latencyFixed),
  supportedAggregations: ['MEAN', 'MIN', 'P50', 'P90', 'P95', 'P99', 'MAX'],
  category: t('in-bizops:customDashboards.latency'),
  min: 0,
  preferredRenderer: Renderer.stackedArea,
  unfoldAggregations: false
};

export const availableMetrics: BizOpsMetric[] = [activitiesCallCount, erroneousCalls, errorRate, latency];
