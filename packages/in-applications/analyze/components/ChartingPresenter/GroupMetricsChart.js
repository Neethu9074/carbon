/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState, useEffect } from 'react';
import { just } from '@instana/observables';

import { getGroupingTagCatalog as getTraceGroupingTagCatalog } from 'in-applications/analyze/components/workspace/TraceGroupingConfigurator';
import { getGroupingTagCatalog as getCallGroupingTagCatalog } from 'in-applications/analyze/components/workspace/CallGroupingConfigurator';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { addGroupingCriteriaToFormModel } from 'in-new-components/AnalyzeView/StateManagement';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { groupLabel } from 'in-applications/analyze/components/GroupedList';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { chartMetricKey } from 'in-applications/analyze/metrics';
import { getResolvedTimeConfig } from 'in-applications/metrics';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { getChartGranularity } from 'in-stores/metric/metric';
import Chart from 'in-components/Chart/ChartReactComponent';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
import { t } from 'in-i18n';

export default function GroupMetricsChart({
  metric,
  aggregation,
  groupsResult,
  dataSource,
  formModel,
  hiddenCalls,
  groupBy,
  renderer,
  formatter,
  groupColors
}) {
  const timeConfig = useTimeConfig();
  const groupingTagCatalog = useTagCatalog(
    dataSource === 'traces' ? getTraceGroupingTagCatalog : getCallGroupingTagCatalog
  );

  // keep metrics fetched through getUnifiedMetrics query in the component state
  const [cachedMetrics, setCachedMetrics] = useState({});

  // reset cached metrics if groups change
  useEffect(() => setCachedMetrics({}), [groupsResult]);

  const metricKey = chartMetricKey(metric, aggregation);
  const chartTimeConfig = getResolvedTimeConfig(timeConfig, groupsResult);
  const granularity = getChartGranularity(timeConfig);
  const nbGroups = groupColors.length;

  const metrics = useObservable(
    ([groupsResult, metric, aggregation, formModel, hiddenCalls, groupBy, groupingTagCatalog]) => {
      // if the groups result is still loading, wait and do nothing
      if (groupingTagCatalog == null || (groupsResult?.progress.loading ?? true)) {
        return just(pendingResult);
      }

      // look for values of the selected metric in the groups result and in the cached metrics
      const resultFromGroups = getMetricsFromGroupsResult(groupsResult, nbGroups, metricKey);
      const resultFromCachedMetrics = cachedMetrics[metricKey];

      if (resultFromGroups && resultFromGroups.length > 0) {
        return just(resultFromGroups);
      } else if (resultFromCachedMetrics) {
        return just(resultFromCachedMetrics);
      } else {
        // if the selected metric does not exist in the groups result and the cached metrics,
        // fetch the values using getUnifiedMetrics
        const chartableDataSeries = groupsResult.items.slice(0, 5).map(item => ({
          label: item.name,
          formModel: addGroupingCriteriaToFormModel(groupBy, item.name, formModel, groupingTagCatalog)
        }));

        return getUnifiedMetrics({
          metrics: chartableDataSeries?.map(({ label, formModel }) => ({
            source: 'APPLICATION',
            dataSource,
            metric,
            timeConfig,
            granularity,
            aggregation,
            label: label,
            tagFilterExpression: toBackendQueryModel(formModel),
            includeInternal: hiddenCalls?.includeInternal,
            includeSynthetic: hiddenCalls?.includeSynthetic
          }))
        }).map(getMetricsFromUnifiedMetricResult);
      }
    },
    [groupsResult, metric, aggregation, formModel, hiddenCalls, groupBy, groupingTagCatalog]
  );

  const loading = metrics?.progress?.loading ?? false;
  if (loading) {
    return <LoadingIndicator height={189} size="xxl" />;
  }

  const noData = !metrics || metrics.length === 0;
  if (noData) {
    return <NoDataAvailable height={189} text={t('in-applications:analyze.chartingPresenter.noData')} />;
  }

  const groups = groupsResult?.items.slice(0, nbGroups);
  const groupNames = groups.map(({ name }) => groupLabel(name));

  // update the cache with the metric values
  if (!cachedMetrics[metricKey]) {
    setCachedMetrics({
      [metricKey]: metrics,
      ...cachedMetrics
    });
  }

  const y1 = {
    labels: groupNames,
    renderer: renderer,
    formatter: formatter,
    colors: groupColors,
    metrics,
    aggregations: Array(groups.length).fill(aggregation),
    min: 0
  };

  return (
    <Chart
      timeConfig={chartTimeConfig}
      y1={y1}
      granularity={granularity}
      renderLegend={false}
      legendColorIndicatorShape="rect"
      restrictTooltipItemsTo={5}
    />
  );
}

function getMetricsFromGroupsResult(result, nbGroups, metricKey) {
  const groups = result?.items.slice(0, nbGroups);
  return groups?.map(group => group.metrics[metricKey]).filter(Boolean);
}

function getMetricsFromUnifiedMetricResult(result) {
  if (result?.progress.loading) {
    return result;
  } else {
    return result?.data?.map(group => group.values);
  }
}
