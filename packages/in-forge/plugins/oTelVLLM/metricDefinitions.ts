/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// @ts-expect-error
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['vllm.status'],
    labels: [t('in-forge:plugins.oTelVLLM.vllm_status')],
    category: [t('in-forge:plugins.oTelVLLM.label_category_VLLM')],
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('vllm.request.running.count', 'value', t('in-forge:plugins.oTelVLLM.service'))],
    labels: [t('in-forge:plugins.oTelVLLM.dashboard.runningRequests')],
    category: [t('in-forge:plugins.oTelVLLM.label_category_VLLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('vllm.request.waiting.count', 'value', t('in-forge:plugins.oTelVLLM.service'))],
    labels: [t('in-forge:plugins.oTelVLLM.dashboard.waitingRequests')],
    category: [t('in-forge:plugins.oTelVLLM.label_category_VLLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('vllm.gpu.cache.usage.perc', 'value', t('in-forge:plugins.oTelVLLM.service'))],
    labels: [t('in-forge:plugins.oTelVLLM.dashboard.gpuUsage')],
    category: [t('in-forge:plugins.oTelVLLM.label_category_VLLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('vllm.gpu.cache.hit.rate', 'value', t('in-forge:plugins.oTelVLLM.service'))],
    labels: [t('in-forge:plugins.oTelVLLM.dashboard.gpuCacheHitRate')],
    category: [t('in-forge:plugins.oTelVLLM.label_category_VLLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('vllm.request.latency', 'value', t('in-forge:plugins.oTelVLLM.service'))],
    labels: [t('in-forge:plugins.oTelVLLM.dashboard.latency')],
    category: [t('in-forge:plugins.oTelVLLM.label_category_VLLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('vllm.request.ttft', 'value', t('in-forge:plugins.oTelVLLM.service'))],
    labels: [t('in-forge:plugins.oTelVLLM.dashboard.ttft')],
    category: [t('in-forge:plugins.oTelVLLM.label_category_VLLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('vllm.tokens.prompt.count', 'value', t('in-forge:plugins.oTelVLLM.service'))],
    labels: [t('in-forge:plugins.oTelVLLM.dashboard.promptTokens')],
    category: [t('in-forge:plugins.oTelVLLM.label_category_VLLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('vllm.tokens.generation.count', 'value', t('in-forge:plugins.oTelVLLM.service'))],
    labels: [t('in-forge:plugins.oTelVLLM.dashboard.generationTokens')],
    category: [t('in-forge:plugins.oTelVLLM.label_category_VLLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('vllm.tokens.total.count', 'value', t('in-forge:plugins.oTelVLLM.service'))],
    labels: [t('in-forge:plugins.oTelVLLM.dashboard.tokens')],
    category: [t('in-forge:plugins.oTelVLLM.label_category_VLLM')],
    min: 0,
    formatter: number
  }
];
