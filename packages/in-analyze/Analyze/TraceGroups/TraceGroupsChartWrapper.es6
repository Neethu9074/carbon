import React from 'react';

import { getChartGranularity, normalizeTimeFrame } from 'in-applications/metrics';
import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
import HorizontalIndicator from 'in-components/Progress/HorizontalIndicator';
import getMetrics from 'in-subscription/application/getMetrics';
import Chart from 'in-components/Chart/ChartReactComponent';
import { deepCopy } from 'in-services/util/object';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    // Create subscriptions for the top 8 trace groups. Actually, one subscription that fetches chart data for all
    // groups in one call would be much better, but that is not possible right now.
    const { groups } = props;
    const subscriptions = {};
    groups.forEach(group => {
      const metricsConfiguration = deepCopy(props.metricsConfiguration);
      metricsConfiguration.filter.traceGroupName = group;
      subscriptions[group] = getMetrics(metricsConfiguration);
    });
    return subscriptions;
  },

  function TraceGroupsChartWrapper(props) {
    const { groups } = props;
    let group;

    // If at least one subscription has an error, render only the errors.
    // Only render data if all subscriptions have returned without an error.
    const collectedErrors = [];
    for (let i = 0; i < groups.length; i++) {
      group = groups[i];
      if (props[group]) {
        collectedErrors.concat(props[group].errors);
      }
    }
    if (collectedErrors.length > 0) {
      return <ErroneousResultPresenter errors={collectedErrors} />;
    }

    // If at least one subscription is still loading, render a loading placeholder.
    // Only render data if all subscriptions have returned a result.
    for (let i = 0; i < groups.length; i++) {
      group = groups[i];
      if (props[group] && props[group].progress && props[group].progress.loading) {
        return <HorizontalIndicator progress={{ loading: true }} />;
      }
    }

    // All subscriptions have returned the chart data. Let's render the chart, finally.
    return renderChart(props);
  }
);

function renderChart(props) {
  const { groups } = props;
  const metricId = props.y1.metricIds[0];

  // Problem: We need a server response timestamp to render the chart (in case of live data).
  // Each individual result has its own response timestamp. For now, we choose the timestamp
  // of the first group arbitrarily for all groups.
  const timeframe = normalizeTimeFrame(props.timeframe, props[groups[0]].time);
  const granularity = getChartGranularity(props.timeframe);

  const chartData = deepCopy(props);
  chartData.y1.labels = groups;
  chartData.y1.metricIds = groups;
  chartData.y1.metrics = groups.map(group => chartData[group].data[metricId]);
  chartData.y1.aggregations = Array(groups.length).fill(chartData.metricsConfiguration.metrics[metricId].aggregation);

  return <Chart timeframe={timeframe} y1={chartData.y1} granularity={granularity} />;
}
