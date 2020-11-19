import React from 'react';

import { NO_VALUE, NO_VALUE_LABEL, UNSPECIFIED } from 'in-analyze/components/GroupedTraces/Group';
import { getChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { chartMetricKey } from 'in-applications/analyze/metrics';
import Chart from 'in-components/Chart/ChartReactComponent';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function GroupMetricsChart({
  metric,
  aggregation,
  result,
  dataSource,
  renderer,
  formatter,
  groupColors
}) {
  const timeConfig = useTimeConfig();

  const loading = result?.progress.loading ?? true;
  if (loading) {
    return <LoadingIndicator height={189} size="xxl" />;
  }

  const metricKey = chartMetricKey(metric, aggregation);
  const items = result?.items;
  const groups = items.slice(0, groupColors.length);
  if (groups.length === 0 || !groups[0]?.metrics || !groups[0]?.metrics[metricKey]) {
    return <NoDataAvailable height={189} icon={'lib_bar_chart'} text={'No data to display'} />;
  }

  const chartTimeConfig = getResolvedTimeConfig(timeConfig, result);

  const granularity = getChartGranularity(timeConfig);
  const groupNames = groups.map(group => groupLabel(group.name, dataSource));
  const y1 = {
    labels: groupNames,
    renderer: renderer,
    formatter: formatter,
    colors: groupColors,
    metrics: groups.map(group => group.metrics[metricKey]),
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

function groupLabel(itemName, dataSource) {
  if (dataSource === 'calls') {
    if (itemName === NO_VALUE) {
      return NO_VALUE_LABEL;
    }
    if (itemName === UNSPECIFIED) {
      return 'No tag present';
    }
  }
  return itemName;
}
