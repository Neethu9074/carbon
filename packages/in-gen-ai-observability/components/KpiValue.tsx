/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useMemo } from 'react';

import { ResultPrecisionDetails, TimeConfig, UnifiedMetricConfigurationUnion } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection/KpiSection';
import { extendWindowSizeOnLiveMode } from 'in-applications/metrics';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { cost } from 'in-gen-ai-observability/utils/formatters';
import { FormatterFn } from 'in-stores/metric/formatters';
import useTimeConfig from 'in-hooks/useTimeConfig';

interface MetricResult {
  id: string;
  values: [number, number][];
  label: string;
  resultPrecisionDetails: ResultPrecisionDetails;
}

interface MetricConfig {
  metricName: string;
  tag?: string;
  formatter?: string | FormatterFn;
  calculationMode: 'sum' | 'count';
  label: string;
  tokenMetricName?: string;
}

export default function KpiValue() {
  const timeConfig = useTimeConfig();

  // Metrics configurations
  const metricConfigs: MetricConfig[] = useMemo(
    () => [
      {
        metricName: 'metrics.gauges.llm.usage.input_cost',
        tag: 'metric.tag.model_id',
        formatter: 'number.compact',
        calculationMode: 'sum',
        label: t('in-gen-ai-observability:llmPage.inputCost'),
        tokenMetricName: 'metrics.gauges.llm.usage.input_tokens'
      },
      {
        metricName: 'metrics.gauges.llm.usage.output_cost',
        tag: 'metric.tag.model_id',
        formatter: 'number.compact',
        calculationMode: 'sum',
        label: t('in-gen-ai-observability:llmPage.outputCost'),
        tokenMetricName: 'metrics.gauges.llm.usage.output_tokens'
      },
      {
        metricName: 'metrics.gauges.llm.usage.cost',
        tag: 'metric.tag.model_id',
        formatter: 'number.compact',
        calculationMode: 'sum',
        label: t('in-gen-ai-observability:llmPage.totalCost'),
        tokenMetricName: 'metrics.gauges.llm.usage.total_tokens'
      },
      {
        metricName: 'metrics.gauges.llm.usage.input_cost',
        tag: 'metric.tag.model_id',
        formatter: 'number',
        calculationMode: 'count',
        label: t('in-gen-ai-observability:llmPage.models')
      },
      {
        metricName: 'metrics.gauges.llm.service.usage.input_cost',
        tag: 'metric.tag.service_name',
        formatter: 'number',
        calculationMode: 'count',
        label: t('in-gen-ai-observability:llmPage.genAiServices')
      },
      {
        metricName: 'metrics.sums.llm.request.count',
        tag: 'metric.tag.model_id',
        formatter: 'number.compact',
        calculationMode: 'sum',
        label: t('in-gen-ai-observability:llmPage.llmCalls')
      }
    ],
    []
  );

  // Create all metric configs
  const allConfigs = useMemo(() => {
    const configs = [];

    // Add cost configs
    for (const config of metricConfigs) {
      if (config.metricName) {
        configs.push({
          key: `cost-${config.metricName}`,
          config: createMetricConfig(config.metricName, config.tag, config.formatter)
        });
      }

      // Add token configs if applicable
      if (config.tokenMetricName) {
        configs.push({
          key: `token-${config.tokenMetricName}`,
          config: createMetricConfig(config.tokenMetricName, config.tag, 'number')
        });
      }
    }

    return configs;
  }, [metricConfigs]);

  const inputCostResult = useResultData(allConfigs[0].config, timeConfig);
  const inputTokensResult = useResultData(allConfigs[1].config, timeConfig);
  const outputCostResult = useResultData(allConfigs[2].config, timeConfig);
  const outputTokensResult = useResultData(allConfigs[3].config, timeConfig);
  const totalCostResult = useResultData(allConfigs[4].config, timeConfig);
  const totalTokensResult = useResultData(allConfigs[5].config, timeConfig);
  const modelsResult = useResultData(allConfigs[6].config, timeConfig);
  const servicesResult = useResultData(allConfigs[7].config, timeConfig);
  const callsResult = useResultData(allConfigs[8].config, timeConfig);

  const metricsData = useMemo(() => {
    return [
      // Input cost
      {
        value: calculateValue(inputCostResult, metricConfigs[0].calculationMode),
        tokenValue: calculateValue(inputTokensResult, 'sum'),
        label: metricConfigs[0].label,
        calculationMode: metricConfigs[0].calculationMode,
        metricName: metricConfigs[0].metricName,
        hasTokens: true
      },
      // Output cost
      {
        value: calculateValue(outputCostResult, metricConfigs[1].calculationMode),
        tokenValue: calculateValue(outputTokensResult, 'sum'),
        label: metricConfigs[1].label,
        calculationMode: metricConfigs[1].calculationMode,
        metricName: metricConfigs[1].metricName,
        hasTokens: true
      },
      // Total cost
      {
        value: calculateValue(totalCostResult, metricConfigs[2].calculationMode),
        tokenValue: calculateValue(totalTokensResult, 'sum'),
        label: metricConfigs[2].label,
        calculationMode: metricConfigs[2].calculationMode,
        metricName: '',
        hasTokens: true
      },
      // Models
      {
        value: calculateValue(modelsResult, metricConfigs[3].calculationMode),
        tokenValue: 0,
        label: metricConfigs[3].label,
        calculationMode: metricConfigs[3].calculationMode,
        metricName: metricConfigs[3].metricName,
        hasTokens: false
      },
      // Services
      {
        value: calculateValue(servicesResult, metricConfigs[4].calculationMode),
        tokenValue: 0,
        label: metricConfigs[4].label,
        calculationMode: metricConfigs[4].calculationMode,
        metricName: metricConfigs[4].metricName,
        hasTokens: false
      },
      // Calls
      {
        value: calculateValue(callsResult, metricConfigs[5].calculationMode),
        tokenValue: 0,
        label: metricConfigs[5].label,
        calculationMode: metricConfigs[5].calculationMode,
        metricName: metricConfigs[5].metricName,
        hasTokens: false
      }
    ];
  }, [
    inputCostResult,
    outputCostResult,
    inputTokensResult,
    outputTokensResult,
    totalCostResult,
    totalTokensResult,
    modelsResult,
    servicesResult,
    callsResult,
    metricConfigs
  ]);

  const formatValue = (value: number, calculationMode: string, metricName: string) => {
    const metricNameStr = metricName || '';

    if (value === undefined || value === null) return '-';

    if (value === 0) {
      if (metricNameStr.includes('cost') || metricNameStr.includes('tokens') || metricNameStr === '') {
        return calculationMode === 'sum' && metricNameStr.includes('cost') ? cost.compact(0) : '0';
      }
      return '-';
    }

    if (calculationMode === 'sum' && metricNameStr.includes('request.count')) {
      return Math.round(value);
    }

    if (calculationMode === 'sum' && (metricNameStr.includes('cost') || metricNameStr === '')) {
      return cost.compact(value);
    }

    return value;
  };

  const validMetricsData = Array.isArray(metricsData) ? metricsData : [];

  return (
    <KpiSection>
      {validMetricsData.map((metric, index) => (
        <KpiKeyValue key={index} label={metric?.label || ''}>
          <div>
            {formatValue(metric?.value || 0, metric?.calculationMode || 'sum', metric?.metricName || '')}
            {metric?.hasTokens && <div>{metric?.tokenValue ? Math.round(metric.tokenValue) : 0} tokens</div>}
          </div>
        </KpiKeyValue>
      ))}
    </KpiSection>
  );
}

// Function to create metric configuration
function createMetricConfig(metricName: string, tag?: string, formatter?: string | FormatterFn) {
  return {
    formatter: formatter,
    metricConfiguration: {
      formatter: formatter,
      aggregation: 'SUM',
      metric: metricName,
      source: 'INFRASTRUCTURE_METRICS',
      timeShift: 0,
      tagFilterExpression: {
        logicalOperator: 'AND',
        type: 'EXPRESSION',
        elements: []
      },
      allowedCrossSeriesAggregations: [],
      crossSeriesAggregation: 'SUM',
      type: 'oTelLLM',
      metricPath: ['Others', 'OpenTelemetry SDK LLM'],
      grouping: tag
        ? [
            {
              maxResults: 100, // Get more results to ensure we capture all values
              by: {
                groupbyTag: tag,
                groupbyTagEntity: 'DESTINATION',
                groupbyTagSecondLevelKey: ''
              },
              includeOthers: false,
              direction: 'DESC'
            }
          ]
        : [],
      regex: false
    },
    formatterSelected: false
  };
}

function calculateValue(result: any, mode: 'sum' | 'count') {
  if (!result?.data) return 0;

  const metricsData = result.data as unknown as MetricResult[];

  if (mode === 'count') {
    const uniqueEntities = new Set();
    if (Array.isArray(metricsData)) {
      metricsData.forEach(metric => {
        if (metric && metric.label) {
          uniqueEntities.add(metric.label);
        }
      });
    }
    return uniqueEntities.size;
  } else {
    let sum = 0;
    if (Array.isArray(metricsData)) {
      metricsData.forEach(metric => {
        if (metric && metric.values && Array.isArray(metric.values) && metric.values.length > 0) {
          const value = metric.values[0] && metric.values[0][1];
          sum += typeof value === 'number' ? value : 0;
        }
      });
    }
    return sum;
  }
}

// Custom hook to fetch metrics data
function useResultData(config: any, timeConfig: TimeConfig) {
  if (!config) {
    return { data: null };
  }

  const timeConfigExtendedForLiveMode = extendWindowSizeOnLiveMode(timeConfig);

  const metrics: { [key: string]: UnifiedMetricConfigurationUnion } = {
    list: {
      ...config.metricConfiguration,
      timeShift: {
        offset: 0
      },
      timeConfig: timeConfigExtendedForLiveMode,
      resultType: 'SINGLE_NUMBER',
      regex: false
    } as UnifiedMetricConfigurationUnion
  };
  return useObservable(() => getUnifiedMetrics({ metrics }), [timeConfig, config.metricConfiguration.metric]);
}
