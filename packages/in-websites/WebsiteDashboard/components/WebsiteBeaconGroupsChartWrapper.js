import { compose, withState, withProps } from 'recompose';
import { find } from 'lodash';

import GroupMetricsChartPresenter, { getMetricKey } from 'in-analyze/components/GroupMetricsChartPresenter';
import getWebsiteBeaconGroups from 'in-websites/subscriptions/getWebsiteBeaconGroups';
import { getChartGranularity } from 'in-applications/metrics';
import connectTo from 'in-hoc/connectTo';

// Sample Usage
/*
<WebsiteBeaconGroupsChartWrapper
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
  connectTo(({ tagFilters, timeConfig, group, metrics, retrievalSize }) => ({
    result: getWebsiteBeaconGroups({
      pagination: {
        retrievalSize: retrievalSize || 10
      },
      group,
      timeConfig,
      tagFilters,
      order: {
        by: 'name',
        direction: 'ASC'
      },
      metrics: metrics.reduce((agg, metric) => {
        agg[getMetricKey(metric)] = {
          metric: metric.metric,
          aggregation: metric.aggregation,
          granularity: getChartGranularity(timeConfig)
        };
        return agg;
      }, {})
    })
  })),
  withState('selectedMetricKey', 'setSelectedMetricKey', null),
  withProps(({ selectedMetricKey, metrics }) => ({
    selectedMetricKey: selectedMetricKey || getMetricKey(metrics[0]),
    selectedMetricDefinition: find(metrics, m => getMetricKey(m) === selectedMetricKey) || metrics[0]
  }))
)(GroupMetricsChartPresenter);
