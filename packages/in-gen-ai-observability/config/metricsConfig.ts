/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TimeConfig } from '@instana/types';

import { days, hours, minutes, seconds } from 'in-services/time/time';
import { t } from 'in-i18n';

/**
 * Configuration for LLM metrics
 * Defines metrics to be used for different views (model vs service)
 */

/**
 * Calculate chart granularity based on the time window size
 * @param timeConfig The time configuration object
 * @returns The appropriate granularity in milliseconds
 */
export function getChartGranularity(timeConfig: TimeConfig): number {
  let minRollup = seconds.toMillis(10);

  if (timeConfig.windowSize >= days.toMillis(91)) {
    minRollup = days.toMillis(7); // 7-day buckets
  } else if (timeConfig.windowSize > days.toMillis(7)) {
    minRollup = days.toMillis(1); // daily buckets for > 1 week
  } else if (timeConfig.windowSize === days.toMillis(7)) {
    minRollup = hours.toMillis(1); // hourly buckets for exactly 7 days
  } else if (timeConfig.windowSize >= days.toMillis(1)) {
    minRollup = hours.toMillis(1); // hourly buckets for 1–6 days
  } else if (timeConfig.windowSize >= hours.toMillis(12)) {
    minRollup = minutes.toMillis(10);
  } else if (timeConfig.windowSize >= hours.toMillis(6)) {
    minRollup = minutes.toMillis(5);
  } else if (timeConfig.windowSize >= hours.toMillis(1)) {
    minRollup = minutes.toMillis(1);
  } else if (timeConfig.windowSize >= minutes.toMillis(30)) {
    minRollup = seconds.toMillis(30);
  }

  return minRollup;
}

export interface MetricConfig {
  modelMetric: string;
  serviceMetric: string;
  modelTag: string;
  serviceTag: string;
  title: string;
}

export const LLM_METRICS: Record<string, MetricConfig> = {
  tokenUsage: {
    modelMetric: 'metrics.gauges.llm.usage.total_tokens',
    serviceMetric: 'metrics.gauges.llm.service.usage.total_tokens',
    modelTag: 'metric.tag.model_id',
    serviceTag: 'metric.tag.service_name',
    title: t('in-gen-ai-observability:llmPage.tokenUsage')
  },
  calls: {
    modelMetric: 'metrics.sums.llm.request.count',
    serviceMetric: 'metrics.sums.llm.service.request.count',
    modelTag: 'metric.tag.model_id',
    serviceTag: 'metric.tag.service_name',
    title: t('in-gen-ai-observability:llmPage.llmCalls')
  },
  latency: {
    modelMetric: 'metrics.gauges.llm.response.duration',
    serviceMetric: 'metrics.gauges.llm.service.response.duration',
    modelTag: 'metric.tag.model_id',
    serviceTag: 'metric.tag.service_name',
    title: t('in-gen-ai-observability:llmPage.llmLatency')
  },
  cost: {
    modelMetric: 'metrics.gauges.llm.usage.cost',
    serviceMetric: 'metrics.gauges.llm.service.usage.cost',
    modelTag: 'metric.tag.model_id',
    serviceTag: 'metric.tag.service_name',
    title: t('in-gen-ai-observability:llmPage.cost')
  }
};
