import { compose, withState, withProps } from 'recompose';
import { find } from 'lodash';

import GroupMetricsChartPresenter, { getMetricKey } from 'in-analyze/components/GroupMetricsChartPresenter';
import getCallGroups from 'in-subscription/application/getCallGroups';
import { getChartGranularity } from 'in-applications/metrics';
import connectTo from 'in-hoc/connectTo';

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
export default compose(
  withState('selectedMetricKey', 'setSelectedMetricKey', null),
  withProps(({ selectedMetricKey, metrics }) => ({
    selectedMetricKey: selectedMetricKey || getMetricKey(metrics[0]),
    selectedMetricDefinition: find(metrics, m => getMetricKey(m) === selectedMetricKey) || metrics[0]
  })),
  connectTo(
    ({
      tagFilters,
      timeConfig,
      group,
      metrics,
      retrievalSize,
      selectedMetricKey,
      selectedMetricDefinition,
      orderByMetric
    }) => {
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

      return {
        result: getCallGroups({
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
        })
      };
    }
  )
)(GroupMetricsChartPresenter);
