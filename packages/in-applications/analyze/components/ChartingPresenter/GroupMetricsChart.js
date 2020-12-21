import React, { useState, useEffect } from 'react';
import { just } from '@instana/observables';

import { chartMetricKey, getMetricAndAggregationFromMetricKey } from 'in-applications/analyze/metrics';
import { getChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { groupLabel } from 'in-applications/analyze/components/GroupedList';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import Chart from 'in-components/Chart/ChartReactComponent';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';

export default function GroupMetricsChart({
  metric,
  aggregation,
  groupsResult,
  dataSource,
  tagFilterExpression,
  hiddenCalls,
  groupBy,
  orderBy,
  renderer,
  formatter,
  groupColors
}) {
  const timeConfig = useTimeConfig();

  // keep metrics fetched through getUnifiedMetrics query in the component state
  const [cachedMetrics, setCachedMetrics] = useState({});

  // reset cached metrics if groups change
  useEffect(() => setCachedMetrics({}), [groupsResult]);

  const metricKey = chartMetricKey(metric, aggregation);
  const chartTimeConfig = getResolvedTimeConfig(timeConfig, groupsResult);
  const granularity = getChartGranularity(timeConfig);
  const nbGroups = groupColors.length;

  const metrics = useObservable(
    ([groupsResult, metric, aggregation, tagFilterExpression, hiddenCalls, groupBy, orderBy]) => {
      // if the groups result is still loading, wait and do nothing
      if (groupsResult?.progress.loading ?? true) {
        return just(groupsResult);
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
        const orderByMetricAndAggregation = getMetricAndAggregationFromMetricKey(orderBy.by);
        return getUnifiedMetrics({
          metrics: {
            [metricKey]: {
              source: 'APPLICATION',
              dataSource,
              metric,
              timeConfig,
              granularity,
              aggregation,
              tagFilterExpression,
              includeInternal: hiddenCalls?.includeInternal,
              includeSynthetic: hiddenCalls?.includeSynthetic,
              grouping: [
                {
                  by: groupBy,
                  // groups can be sorted by a metric different than the metric displayed in the chart
                  metric: orderByMetricAndAggregation.metric,
                  aggregation: orderByMetricAndAggregation.aggregation,
                  maxResults: 5,
                  direction: orderBy.direction,
                  includeUnmatched: true
                }
              ]
            }
          }
        }).map(getMetricsFromUnifiedMetricResult);
      }
    },
    [groupsResult, metric, aggregation, tagFilterExpression, hiddenCalls, groupBy, orderBy]
  );

  const loading = metrics?.progress?.loading;
  if (loading) {
    return <LoadingIndicator height={189} size="xxl" />;
  }

  const noData = !metrics || metrics.length === 0;
  if (noData) {
    return <NoDataAvailable height={189} icon={'lib_bar_chart'} text={'No data to display'} />;
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
