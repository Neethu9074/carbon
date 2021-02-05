/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';
import { find } from 'lodash';

import GroupMetricsChartPresenter, {
  getMetricKey
} from 'in-analyze/components/MetricsChart/GroupMetricsChartPresenter';
import getCallGroups from 'in-subscription/application/getCallGroups';
import { getChartGranularity } from 'in-stores/metric/metric';
import { pendingResult } from 'in-services/fixedObjects';
import useObservable from 'in-hooks/useObservable';

// Sample Usage
/*
<CallGroupsChartWrapper
            cardTitle="My First Chart"
            timeConfig={timeConfig}
            tagFilters={tagFilters}
            group={{
              groupbyTag: 'data.grouping.key'
            }}
            metrics={[
              {
                label: 'Count',
                metric: 'count',
                aggregation: 'SUM',
                formatter: number,
                renderer: Renderer.stackedBar
              }
            ]}

            // OPTIONAL FIELDS //

            metricIds={['group 1', 'group 2', 'group 3']}  <-- If present, all groups that will be drawn / in the legend
            translateLabel={key => getLabelFor(key)}  <-- Function to translate the metricIds or groups to nice label
            translateColor={key => getColorFor(key)}  <-- Function to translate the metricIds or groups to a fixed color
          />
*/

export default function CallGroupsChartWrapper(props) {
  const { retrievalSize, group, timeConfig, tagFilters, orderByMetric, metrics } = props;

  const [selectedMetricKeyState, setSelectedMetricKey] = useState(null);
  const selectedMetricKey = selectedMetricKeyState || getMetricKey(metrics[0]);
  const selectedMetricDefinition = find(metrics, m => getMetricKey(m) === selectedMetricKey) || metrics[0];

  const result =
    useObservable(getCallGroupsObservable, [
      retrievalSize,
      group,
      timeConfig,
      tagFilters,
      orderByMetric,
      selectedMetricKey,
      selectedMetricDefinition,
      metrics
    ]) ?? pendingResult;

  return (
    <GroupMetricsChartPresenter
      {...props}
      result={result}
      selectedMetricKey={selectedMetricKey}
      setSelectedMetricKey={setSelectedMetricKey}
      selectedMetricDefinition={selectedMetricDefinition}
    />
  );
}

function getCallGroupsObservable([
  retrievalSize,
  group,
  timeConfig,
  tagFilters,
  orderByMetric,
  selectedMetricKey,
  selectedMetricDefinition,
  metrics
]) {
  const metricsForSubscription = metrics.reduce((agg, metric) => {
    agg[getMetricKey(metric)] = {
      metric: metric.metric,
      aggregation: metric.aggregation,
      granularity: getChartGranularity(timeConfig)
    };
    return agg;
  }, {});

  let order;
  if (orderByMetric != null) {
    const aggregatedMetricKey = `${selectedMetricKey}__Agg`;
    order = {
      by: aggregatedMetricKey,
      // not configurable for now
      direction: 'DESC'
    };

    // We need to add an aggregated metric to the list of metrics so that we can order by it
    metricsForSubscription[aggregatedMetricKey] = {
      metric: selectedMetricDefinition.metric,
      aggregation: selectedMetricDefinition.aggregation
    };
  } else {
    order = {
      by: 'name',
      direction: 'ASC'
    };
  }

  return getCallGroups({
    pagination: {
      retrievalSize: retrievalSize || 10
    },
    group,
    filter: {
      timeConfig
    },
    tagFilters,
    order,
    metrics: metricsForSubscription
  });
}
