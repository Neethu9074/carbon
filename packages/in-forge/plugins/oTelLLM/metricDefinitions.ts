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
    metrics: ['llm.status'],
    labels: [t('in-forge:plugins.oTelLLM.llm_status')],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('llm.usage.total_tokens', 'value', t('in-forge:plugins.oTelLLM.model'))],
    labels: [t('in-forge:plugins.oTelLLM.dashboard.token')],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('llm.usage.input_tokens', 'value', t('in-forge:plugins.oTelLLM.model'))],
    labels: [t('in-forge:plugins.oTelLLM.dashboard.inputToken')],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('llm.usage.output_tokens', 'value', t('in-forge:plugins.oTelLLM.model'))],
    labels: [t('in-forge:plugins.oTelLLM.dashboard.outputToken')],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('llm.usage.cost', 'value', t('in-forge:plugins.oTelLLM.model'))],
    labels: [t('in-forge:plugins.oTelLLM.dashboard.cost')],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('llm.usage.input_cost', 'value', t('in-forge:plugins.oTelLLM.model'))],
    labels: [t('in-forge:plugins.oTelLLM.dashboard.inputCost')],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('llm.usage.output_cost', 'value', t('in-forge:plugins.oTelLLM.model'))],
    labels: [t('in-forge:plugins.oTelLLM.dashboard.outputCost')],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('llm.request.count', 'value', t('in-forge:plugins.oTelLLM.model'))],
    labels: [t('in-forge:plugins.oTelLLM.dashboard.count')],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('llm.response.duration', 'value', t('in-forge:plugins.oTelLLM.model'))],
    labels: [t('in-forge:plugins.oTelLLM.dashboard.duration')],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('llm.service.usage.total_tokens', 'value', t('in-forge:plugins.oTelLLM.service'))],
    labels: [t('in-forge:plugins.oTelLLM.dashboard.serviceToken')],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('llm.service.usage.input_tokens', 'value', t('in-forge:plugins.oTelLLM.service'))],
    labels: [t('in-forge:plugins.oTelLLM.dashboard.serviceInputToken')],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('llm.service.usage.output_tokens', 'value', t('in-forge:plugins.oTelLLM.service'))],
    labels: [t('in-forge:plugins.oTelLLM.dashboard.serviceOutputToken')],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('llm.service.usage.cost', 'value', t('in-forge:plugins.oTelLLM.service'))],
    labels: [t('in-forge:plugins.oTelLLM.dashboard.serviceCost')],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('llm.service.usage.input_cost', 'value', t('in-forge:plugins.oTelLLM.service'))],
    labels: [t('in-forge:plugins.oTelLLM.dashboard.serviceInputCost')],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('llm.service.usage.output_cost', 'value', t('in-forge:plugins.oTelLLM.service'))],
    labels: [t('in-forge:plugins.oTelLLM.dashboard.serviceOutputCost')],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('llm.service.request.count', 'value', t('in-forge:plugins.oTelLLM.service'))],
    labels: [t('in-forge:plugins.oTelLLM.dashboard.serviceCount')],
    category: [t('in-forge:plugins.oTelLLM.label_category_LLM')],
    min: 0,
    formatter: number
  }
];
