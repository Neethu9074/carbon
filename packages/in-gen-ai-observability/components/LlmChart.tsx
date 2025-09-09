/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { ReactElement, useMemo } from 'react';

import { TimeConfig, UnifiedMetricConfigurationUnion, AggregationType } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import { LLM_METRICS, MetricConfig, getChartGranularity } from 'in-gen-ai-observability/config/metricsConfig';
import { AxisConfiguration, ContextMenuButton, AdditionChartContentProps } from 'in-components/Chart/types';
import { TimeShiftAwareChartSelectorWithUrlState } from 'in-components/ChartSelectors/ChartSelectors';
import { useLlmMetrics, extractMetricsData } from 'in-gen-ai-observability/hooks/useLlmMetrics';
import { ChartReactComponentProps } from 'in-components/Chart/ChartReactComponent';
import { llmMetricsMonitoring } from 'in-gen-ai-observability/navigation/paths';
import { extendWindowSizeOnLiveMode } from 'in-applications/metrics';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { cost } from 'in-gen-ai-observability/utils/formatters';
import { number, millis } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { pendingResult } from 'in-services/fixedObjects';

const tabByModel = {
  id: 'byModel',
  label: t('in-gen-ai-observability:llmPage.byModel')
};

const tabByService = {
  id: 'byService',
  label: t('in-gen-ai-observability:llmPage.byService')
};

const tabDistribution = {
  id: 'distribution',
  label: t('in-gen-ai-observability:llmPage.distribution')
};

// Define which tabs are available for each metric type
const tabsByMetricType: Record<keyof typeof LLM_METRICS, Array<{ id: string; label: string }>> = {
  tokenUsage: [tabByModel, tabByService],
  calls: [tabByModel, tabByService],
  latency: [tabByModel], // Latency only has byModel tab
  cost: [tabByModel, tabByService]
};

export interface LlmChartProps {
  timeConfig: TimeConfig;
  title?: string;
  rightHeaderContent?: ReactElement;
  primaryContextMenuAction?: string;
  additionalContextMenuButtons?: ContextMenuButton[];
  renderPostChartContent?: (props: AdditionChartContentProps) => React.ReactNode;
  renderHistoricDataIndicator?: boolean;
  urlMatrixParamConfig?: { path: string; paramTab: string; paramMetric: string };
  metricType: keyof typeof LLM_METRICS;
  metricConfig?: MetricConfig;
}

export default function LlmChart({
  rightHeaderContent,
  timeConfig,
  primaryContextMenuAction,
  additionalContextMenuButtons,
  renderPostChartContent,
  renderHistoricDataIndicator,
  urlMatrixParamConfig,
  metricType,
  metricConfig
}: LlmChartProps) {
  // Use provided metricConfig or get from LLM_METRICS
  // Add fallback to tokenUsage if the specified metric type doesn't exist
  const config = metricConfig || LLM_METRICS[metricType] || LLM_METRICS.tokenUsage;

  // Set default title if not provided
  const chartTitle = config.title;

  // Set default URL matrix param config if not provided
  const defaultUrlMatrixParamConfig = {
    path: llmMetricsMonitoring,
    paramTab: metricType === 'latency' ? 'latencyTab' : 'chartTab',
    paramMetric: metricType === 'latency' ? 'latencyMetric' : 'chartMetric'
  };

  const chartUrlMatrixParamConfig = urlMatrixParamConfig || defaultUrlMatrixParamConfig;

  // Get tabs for this metric type
  const tabs = tabsByMetricType[metricType] || [tabByModel, tabByService];

  return (
    <TimeShiftAwareChartSelectorWithUrlState
      cardTitle={chartTitle}
      tabs={tabs}
      metrics={[]} // No metrics needed as we're handling them dynamically
      urlMatrixParamConfig={chartUrlMatrixParamConfig}
    >
      <ChartPresenter
        rightHeaderContent={rightHeaderContent}
        timeConfig={timeConfig}
        title={chartTitle}
        primaryContextMenuAction={primaryContextMenuAction}
        additionalContextMenuButtons={additionalContextMenuButtons}
        renderPostChartContent={renderPostChartContent}
        renderHistoricDataIndicator={renderHistoricDataIndicator}
        metricType={metricType}
        metricConfig={config}
      />
    </TimeShiftAwareChartSelectorWithUrlState>
  );
}

interface ChartPresenterProps extends Omit<LlmChartProps, 'urlMatrixParamConfig'> {
  selectedTabId?: string;
  selectedMetricValue?: string;
  timeShiftConfig?: { offset: number };
  selectorComponent?: React.ReactElement;
}

function ChartPresenter({
  rightHeaderContent,
  timeConfig,
  primaryContextMenuAction,
  additionalContextMenuButtons,
  renderPostChartContent,
  renderHistoricDataIndicator,
  selectedTabId,
  selectorComponent,
  metricType,
  metricConfig
}: ChartPresenterProps) {
  // Determine groupBy and metrics based on selected tab and metric type
  const groupBy = selectedTabId === tabByService.id ? 'service_name' : 'model_id';

  // Ensure metricConfig is defined (it should always be since we provide a default in the parent component)
  if (!metricConfig) {
    throw new Error(`MetricConfig for ${metricType} is undefined`);
  }

  const metricName = selectedTabId === tabByService.id ? metricConfig.serviceMetric : metricConfig.modelMetric;
  const tag = selectedTabId === tabByService.id ? metricConfig.serviceTag : metricConfig.modelTag;

  // Determine renderer based on tab and metric type
  const renderer = selectedTabId === tabDistribution.id ? Renderer.bar : Renderer.line;

  // Get data based on metric type
  const result =
    metricType === 'cost'
      ? useTotalCostData(tag, groupBy, timeConfig)
      : useLlmMetrics({
          metricName,
          tag,
          groupBy,
          timeConfig,
          crossSeriesAggregation: 'SUM'
        });

  // Extract metrics data
  const { metricsData, labels } =
    metricType === 'cost'
      ? useMemo(() => {
          let extractedMetricsData: any[] = [];
          let extractedLabels: string[] = [];

          if (result && result.data) {
            if (Array.isArray(result.data)) {
              extractedMetricsData = result.data.map((item: any) => {
                const values = item.values || [];
                return values.filter((point: any) => Array.isArray(point) && point.length === 2);
              });
              extractedLabels = result.data.map((item: any) => item.label || 'Data');
            }
          }

          return { metricsData: extractedMetricsData, labels: extractedLabels };
        }, [result])
      : extractMetricsData(result);

  // Determine formatter based on metric type
  const getFormatter = () => {
    switch (metricType) {
      case 'latency':
        return millis.detailed;
      case 'cost':
        return cost.detailed;
      default:
        return metricName.includes('token') ? number.detailed : number.compact;
    }
  };

  // Determine tooltip formatter based on metric type
  const getTooltipFormatter = () => {
    switch (metricType) {
      case 'latency':
        return (value: number) => `${Math.round(value)} ms`;
      case 'cost':
        return cost.detailed;
      default:
        return (value: number) => {
          if (metricName.includes('token')) {
            return Math.round(value).toString();
          }
          return value.toFixed(4);
        };
    }
  };

  const y1: AxisConfiguration = {
    min: 0,
    formatter: getFormatter(),
    tooltipFormatter: getTooltipFormatter(),
    renderer,
    metrics: metricsData,
    metricIds: metricsData.map((_, i) => `metric-${i}`),
    labels: labels,
    colors: [],
    ...(metricType === 'cost' ? { aggregations: ['SUM' as AggregationType] } : {})
  };

  const chartConfig: ChartReactComponentProps = {
    title: metricConfig ? metricConfig.title : '',
    rightHeaderContent: selectorComponent || rightHeaderContent,
    granularity: getChartGranularity(timeConfig),
    primaryContextMenuAction,
    additionalContextMenuButtons,
    y1,
    renderPostChartContent,
    renderHistoricDataIndicator,
    timeConfig
  };

  return <ResultAwareChart result={result} config={chartConfig} />;
}

// Special data fetching function for cost metrics
function useTotalCostData(tag: string, groupBy: string, timeConfig: TimeConfig) {
  const minRollup = getChartGranularity(timeConfig);
  const timeConfigExtendedForLiveMode = extendWindowSizeOnLiveMode(timeConfig);
  const isServiceMetric = tag === 'metric.tag.service_name';
  const costConfig = LLM_METRICS.cost;
  const metricName = isServiceMetric ? costConfig.serviceMetric : costConfig.modelMetric;

  const metricConfig: UnifiedMetricConfigurationUnion = {
    aggregation: 'SUM',
    metric: metricName,
    source: 'INFRASTRUCTURE_METRICS',
    timeShift: {
      offset: 0
    },
    tagFilterExpression: {
      logicalOperator: 'AND',
      type: 'EXPRESSION',
      elements: []
    },
    type: 'oTelLLM',
    crossSeriesAggregation: 'SUM' as AggregationType,
    grouping: [
      {
        maxResults: 10,
        by: {
          groupbyTag: tag,
          groupbyTagEntity: 'DESTINATION',
          groupbyTagSecondLevelKey: ''
        },
        includeOthers: false,
        includeUnmatched: false,
        direction: 'DESC'
      }
    ],
    timeConfig: timeConfigExtendedForLiveMode,
    resultType: 'TIME_SERIES',
    regex: false,
    granularity: minRollup
  };

  const metrics = {
    totalCost: metricConfig
  };

  return useObservable(() => getUnifiedMetrics({ metrics }), [timeConfig, tag, groupBy, metricName]) ?? pendingResult;
}
