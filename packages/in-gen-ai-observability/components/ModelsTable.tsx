/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { TimeConfig, UnifiedMetricConfigurationUnion } from '@instana/types';
import { DataTable, Stack, Pagination, Card } from '@instana/components';
import { NoDataEmptyState } from '@instana/ibm-products';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';
import { Result } from '@instana/types';

import { extendWindowSizeOnLiveMode } from 'in-applications/metrics';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { number } from 'in-services/formatters/number';
import useTimeConfig from 'in-hooks/useTimeConfig';

import locals from './ModelsTable.mless';

interface ModelRow {
  id: string;
  modelName: string;
  inputTokens: string;
  outputTokens: string;
  totalTokens: string;
  totalCost: string;
  latency: string;
  numberOfCalls: string;
}

interface SortStateProps {
  sortHeaderKey: string;
  sortDirection: string;
}

interface ModelData {
  modelName: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  totalCost?: number;
  latency?: number;
  numberOfCalls?: number;
  [key: string]: string | number | undefined;
}

// Generic type for metric results
type MetricResult<T = any> = Result<T> | null | undefined;

function isLoading<T>(results: Array<Result<T> | null | undefined>): boolean {
  return results.some(result => !result || !result.data || result.progress?.loading);
}

export default function ModelsTable() {
  const timeConfig = useTimeConfig();
  const [sortKey, setSortKey] = useState<string>('modelName');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC' | 'NONE'>('NONE');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchText, setSearchText] = useState<string>('');

  // Define the table headers
  const headers = [
    {
      ellipsis: true,
      header: t('in-gen-ai-observability:llmPage.modelName'),
      isSortable: true,
      key: 'modelName',
      sortDirection: sortKey === 'modelName' ? sortDirection : 'NONE',
      width: '20vw'
    },
    {
      header: t('in-gen-ai-observability:llmPage.inputTokens'),
      isSortable: true,
      key: 'inputTokens',
      sortDirection: sortKey === 'inputTokens' ? sortDirection : 'NONE'
    },
    {
      header: t('in-gen-ai-observability:llmPage.outputTokens'),
      isSortable: true,
      key: 'outputTokens',
      sortDirection: sortKey === 'outputTokens' ? sortDirection : 'NONE'
    },
    {
      header: t('in-gen-ai-observability:llmPage.totalTokens'),
      isSortable: true,
      key: 'totalTokens',
      sortDirection: sortKey === 'totalTokens' ? sortDirection : 'NONE'
    },
    {
      header: t('in-gen-ai-observability:llmPage.totalCost'),
      isSortable: true,
      key: 'totalCost',
      sortDirection: sortKey === 'totalCost' ? sortDirection : 'NONE'
    },
    {
      header: t('in-gen-ai-observability:llmPage.latency'),
      isSortable: true,
      key: 'latency',
      sortDirection: sortKey === 'latency' ? sortDirection : 'NONE'
    },
    {
      header: t('in-gen-ai-observability:llmPage.numberOfCalls'),
      isSortable: true,
      key: 'numberOfCalls',
      sortDirection: sortKey === 'numberOfCalls' ? sortDirection : 'NONE'
    }
  ];

  const inputTokensResult = useModelMetricsData('metrics.gauges.llm.usage.input_tokens', timeConfig);
  const outputTokensResult = useModelMetricsData('metrics.gauges.llm.usage.output_tokens', timeConfig);
  const totalTokensResult = useModelMetricsData('metrics.gauges.llm.usage.total_tokens', timeConfig);
  const totalCostResult = useModelMetricsData('metrics.gauges.llm.usage.cost', timeConfig);
  const latencyResult = useModelMetricsData('metrics.gauges.llm.response.duration', timeConfig);
  const callsResult = useModelMetricsData('metrics.sums.llm.request.count', timeConfig);

  const rows = React.useMemo<ModelRow[]>(() => {
    const results = [
      inputTokensResult,
      outputTokensResult,
      totalTokensResult,
      totalCostResult,
      latencyResult,
      callsResult
    ];

    if (isLoading(results)) {
      return [];
    }

    const modelMap = new Map<string, ModelData>();

    const processMetricData = (
      result: MetricResult,
      metricName: 'inputTokens' | 'outputTokens' | 'totalTokens' | 'totalCost' | 'latency' | 'numberOfCalls'
    ) => {
      if (result && Array.isArray(result.data)) {
        result.data.forEach((item: any) => {
          if (item && typeof item === 'object' && item.label) {
            const modelId = item.label;

            if (!modelMap.has(modelId)) {
              modelMap.set(modelId, { modelName: modelId });
            }

            const model = modelMap.get(modelId)!;

            if (
              item.values &&
              Array.isArray(item.values) &&
              item.values.length > 0 &&
              Array.isArray(item.values[0]) &&
              item.values[0].length > 1
            ) {
              model[metricName] = item.values[0][1];
            }
          }
        });
      }
    };

    processMetricData(inputTokensResult, 'inputTokens');
    processMetricData(outputTokensResult, 'outputTokens');
    processMetricData(totalTokensResult, 'totalTokens');
    processMetricData(totalCostResult, 'totalCost');
    processMetricData(latencyResult, 'latency');
    processMetricData(callsResult, 'numberOfCalls');

    return Array.from(modelMap.entries()).map(([_key, model], index) => ({
      id: `model-${index}`,
      modelName: model.modelName || '',

      inputTokens: model.inputTokens !== undefined ? number.compact(model.inputTokens) : '0',
      outputTokens: model.outputTokens !== undefined ? number.compact(model.outputTokens) : '0',
      totalTokens: model.totalTokens !== undefined ? number.compact(model.totalTokens) : '0',
      totalCost: model.totalCost !== undefined ? `$${model.totalCost.toFixed(4)}` : '$0.0000',
      latency: model.latency !== undefined ? `${model.latency.toFixed(4)} ms` : '-',
      numberOfCalls: model.numberOfCalls !== undefined ? number.compact(model.numberOfCalls) : '0'
    }));
  }, [inputTokensResult, outputTokensResult, totalTokensResult, totalCostResult, latencyResult, callsResult]);

  const filteredRows = React.useMemo(() => {
    if (!searchText) {
      return rows;
    }

    const lowerSearchText = searchText.toLowerCase();
    return rows.filter(row => row.modelName.toLowerCase().includes(lowerSearchText));
  }, [rows, searchText]);

  const paginatedRows = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredRows.slice(startIndex, endIndex);
  }, [filteredRows, currentPage, pageSize]);

  const handleSort = (sortState: SortStateProps) => {
    const newSortKey = sortState.sortHeaderKey;
    let newSortDirection: 'ASC' | 'DESC' | 'NONE' = 'ASC';

    if (sortKey === newSortKey) {
      if (sortDirection === 'ASC') {
        newSortDirection = 'DESC';
      } else if (sortDirection === 'DESC') {
        newSortDirection = 'NONE';
      } else {
        newSortDirection = 'ASC';
      }
    }

    setSortKey(newSortKey);
    setSortDirection(newSortDirection);
  };

  const handlePaginationChange = (data: { page: number; pageSize: number }) => {
    setCurrentPage(data.page);
    setPageSize(data.pageSize);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  const dataIsLoading = isLoading([
    inputTokensResult,
    outputTokensResult,
    totalTokensResult,
    totalCostResult,
    latencyResult,
    callsResult
  ]);

  if (dataIsLoading) {
    return (
      <div>
        <div>{t('in-gen-ai-observability:llmPage.loading')}</div>
      </div>
    );
  }

  return (
    <Stack gap="medium">
      <Card title={t('in-gen-ai-observability:llmPage.models')} headingVariant="heading-3" size="l">
        <span>
          <DataTable
            headers={headers}
            rows={paginatedRows}
            sortRow={handleSort}
            size="sm"
            isSearchEnabled
            filterRows={handleSearch}
          />

          {filteredRows.length === 0 ? (
            <div className={locals.whitebg}>
              <NoDataEmptyState
                title={t('in-gen-ai-observability:llmPage.noModelsFound')}
                subtitle={t('in-gen-ai-observability:llmPage.noDataAvailable')}
                illustrationPosition="left"
                className={locals.noDataTile}
              />
            </div>
          ) : (
            <Pagination
              currentPage={currentPage}
              totalItems={filteredRows.length}
              pageSize={pageSize}
              pageSizes={[5, 10, 20, 50]}
              onChange={handlePaginationChange}
            />
          )}
        </span>
      </Card>
      <div />
    </Stack>
  );
}

// Hook to fetch model metrics data
function useModelMetricsData(metricName: string, timeConfig: TimeConfig) {
  const timeConfigExtendedForLiveMode = extendWindowSizeOnLiveMode(timeConfig);

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
    crossSeriesAggregation: 'SUM',
    grouping: [
      {
        maxResults: 100,
        by: {
          groupbyTag: 'metric.tag.model_id',
          groupbyTagEntity: 'DESTINATION',
          groupbyTagSecondLevelKey: ''
        },
        includeOthers: false,
        includeUnmatched: false,
        direction: 'DESC'
      }
    ],
    timeConfig: timeConfigExtendedForLiveMode,
    resultType: 'SINGLE_NUMBER',
    regex: false
  };

  const metrics = {
    data: metricConfig
  };

  return useObservable(() => getUnifiedMetrics({ metrics }), [timeConfig, metricName]);
}
