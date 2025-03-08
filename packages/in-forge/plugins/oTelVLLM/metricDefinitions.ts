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
    labels: [t('in-forge:plugins.oTelLLM.llm_status')],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('vllm.request.running.count', 'value', t('in-forge:plugins.oTelLLM.model'))],
    labels: [t('in-forge:plugins.oTelLLM.dashboard.count')],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('vllm.request.waiting.count', 'value', t('in-forge:plugins.oTelLLM.model'))],
    labels: ['Pending Requests'],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('vllm.gpu.cache.usage.perc', 'value', t('in-forge:plugins.oTelLLM.model'))],
    labels: ['GPU Cache Usage'],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('vllm.gpu.cache.hit.rate', 'value', t('in-forge:plugins.oTelLLM.model'))],
    labels: ['GPU Cache Hit Rate'],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('vllm.request.latency', 'value', t('in-forge:plugins.oTelLLM.model'))],
    labels: ['Latency'],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('vllm.request.ttft', 'value', t('in-forge:plugins.oTelLLM.model'))],
    labels: ['TTFT'],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('vllm.tokens.prompt.count', 'value', t('in-forge:plugins.oTelLLM.model'))],
    labels: ['Prompt Tokens'],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('vllm.tokens.generation.count', 'value', t('in-forge:plugins.oTelLLM.model'))],
    labels: ['Generation Tokens'],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('vllm.tokens.total.count', 'value', t('in-forge:plugins.oTelLLM.model'))],
    labels: ['Total Tokens'],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    min: 0,
    formatter: number
  }
];
