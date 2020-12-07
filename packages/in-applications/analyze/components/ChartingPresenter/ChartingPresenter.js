import React from 'react';

import {
  getGroupChartFormatter,
  defaultRenderer
} from 'in-applications/analyze/components/ChartingPresenter/chartingOptions';
import LatencyDistributionChart from 'in-applications/analyze/components/ChartingPresenter/LatencyDistributionChart';
import GroupMetricsChart from 'in-applications/analyze/components/ChartingPresenter/GroupMetricsChart';

import locals from './ChartingPresenter.mless';

export default function ChartingPresenter({
  dataSource,
  metric,
  aggregation,
  groupBy,
  tagFilterExpression,
  hiddenCalls,
  orderBy,
  updateFilter,
  result,
  groupColors
}) {
  const isGrouped = !!groupBy?.groupbyTag;
  const Presenter = isGrouped ? GroupChartPresenter : SimpleChartPresenter;
  return (
    <div className={locals.main}>
      <Presenter
        metric={metric}
        aggregation={aggregation}
        dataSource={dataSource}
        tagFilterExpression={tagFilterExpression}
        hiddenCalls={hiddenCalls}
        groupBy={groupBy}
        orderBy={orderBy}
        updateFilter={updateFilter}
        result={result}
        groupColors={groupColors}
      />
    </div>
  );
}

// displays charts without grouping
function SimpleChartPresenter({ dataSource, tagFilterExpression, hiddenCalls, updateFilter }) {
  return (
    <LatencyDistributionChart
      dataSource={dataSource}
      tagFilterExpression={tagFilterExpression}
      hiddenCalls={hiddenCalls}
      updateFilter={updateFilter}
    />
  );
}

// displays charts with grouping
function GroupChartPresenter({
  metric,
  aggregation,
  dataSource,
  tagFilterExpression,
  hiddenCalls,
  groupBy,
  orderBy,
  updateFilter,
  result,
  groupColors
}) {
  if (metric === 'latency' && aggregation === 'DISTRIBUTION') {
    return (
      <LatencyDistributionChart
        dataSource={dataSource}
        tagFilterExpression={tagFilterExpression}
        hiddenCalls={hiddenCalls}
        updateFilter={updateFilter}
      />
    );
  }
  return (
    <GroupMetricsChart
      metric={metric}
      aggregation={aggregation}
      groupsResult={result}
      dataSource={dataSource}
      tagFilterExpression={tagFilterExpression}
      hiddenCalls={hiddenCalls}
      groupBy={groupBy}
      orderBy={orderBy}
      formatter={getGroupChartFormatter(metric)}
      // we don't allow to select a chart renderer yet, use the default one
      renderer={defaultRenderer(metric, aggregation).renderer}
      groupColors={groupColors}
    />
  );
}
