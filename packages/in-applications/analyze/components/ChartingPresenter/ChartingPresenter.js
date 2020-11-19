import React from 'react';

import { getGroupChartFormatter, defaultRenderer } from 'in-applications/analyze/components/ChartingPresenter/chartingOptions';
import LatencyDistributionChart from 'in-applications/analyze/components/ChartingPresenter/LatencyDistributionChart';
import GroupMetricsChart from 'in-applications/analyze/components/ChartingPresenter/GroupMetricsChart';

import locals from './ChartingPresenter.mless';

export default function ChartingPresenter({
  dataSource,
  metric,
  aggregation,
  isGrouped,
  tagFilterExpression,
  updateFilter,
  result,
  groupColors
}) {
  const Presenter = isGrouped ? GroupChartPresenter : SimpleChartPresenter;
  return (
    <div className={locals.main}>
      <Presenter
        metric={metric}
        aggregation={aggregation}
        dataSource={dataSource}
        tagFilterExpression={tagFilterExpression}
        updateFilter={updateFilter}
        result={result}
        groupColors={groupColors}
      />
    </div>
  );
}

// displays charts without grouping
function SimpleChartPresenter({ dataSource, tagFilterExpression, updateFilter }) {
  return (
    <LatencyDistributionChart
      dataSource={dataSource}
      tagFilterExpression={tagFilterExpression}
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
  updateFilter,
  result,
  groupColors
}) {
  if (metric === 'latency' && aggregation === 'DISTRIBUTION') {
    return (
      <LatencyDistributionChart
        dataSource={dataSource}
        tagFilterExpression={tagFilterExpression}
        updateFilter={updateFilter}
      />
    );
  }
  return (
    <GroupMetricsChart
      metric={metric}
      aggregation={aggregation}
      result={result}
      dataSource={dataSource}
      formatter={getGroupChartFormatter(metric)}
      // we don't allow to select a chart renderer yet, use the default one
      renderer={defaultRenderer(metric, aggregation).renderer}
      groupColors={groupColors}
    />
  );
}
