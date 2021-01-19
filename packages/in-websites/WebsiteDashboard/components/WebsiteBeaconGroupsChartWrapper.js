/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { compose, withState, withProps } from 'recompose';
import { find } from 'lodash';

import GroupMetricsChartPresenter, {
  getMetricKey
} from 'in-analyze/components/MetricsChart/GroupMetricsChartPresenter';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import getWebsiteBeaconGroups from 'in-websites/subscriptions/getWebsiteBeaconGroups';
import { actionName, getButton } from 'in-components/Chart/actions/viewInAnalytics';
import { getLinkToAnalyze } from 'in-websites/navigation/paths';
import { getChartGranularity } from 'in-applications/metrics';
import { emptyObject } from 'in-services/fixedObjects';
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
            viewInAnalytics={{websiteLabel}}

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
  withProps(({ selectedMetricKey, metrics, viewInAnalytics, tagFilters, group }) => ({
    selectedMetricKey: selectedMetricKey || getMetricKey(metrics[0]),
    selectedMetricDefinition: find(metrics, m => getMetricKey(m) === selectedMetricKey) || metrics[0],
    ...getAdditionalChartActions(tagFilters, metrics, group, viewInAnalytics, selectedMetricKey)
  }))
)(GroupMetricsChartPresenter);

function getAdditionalChartActions(tagFilters, metrics, group, viewInAnalytics, selectedMetricKey) {
  if (!viewInAnalytics || !viewInAnalytics.websiteLabel) {
    if (__DEV__) {
      throw new Error(
        'Incomplete chart configuration for website charts that causes "View in Analyze" to not be available.'
      );
    }
    return emptyObject;
  }

  const beaconType = tagFilters.find(({ name }) => name === 'beacon.type')?.stringValue;
  if (!beaconType) {
    if (__DEV__) {
      throw new Error(
        'Beacon type could not be automatically identified which causes "View in Analyze" not to be available.'
      );
    }
    return emptyObject;
  }

  return {
    primaryContextMenuAction: actionName,
    additionalContextMenuButtons: [
      getButton({
        getHref$(timeConfig) {
          const metricsForAnalyze = metrics
            // This is the default metric that we do not need to show
            .filter(({ metric }) => metric !== 'beaconCount')
            .map(({ metric, aggregation }) => ({ metric, aggregation }))
            // Render at most five additional metrics in analyze
            .slice(0, 5);

          let focusedMetric = metricsForAnalyze.length > 0 && metricsForAnalyze[0].metric;
          let focusedMetricAggregation = metricsForAnalyze.length > 0 && metricsForAnalyze[0].aggregation;
          for (const metric of metricsForAnalyze) {
            if (getMetricKey(metric) === selectedMetricKey) {
              focusedMetric = metric.metric;
              focusedMetricAggregation = metric.aggregation;
              break;
            }
          }

          return getLinkToAnalyze({
            tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({
              websiteLabel: viewInAnalytics.websiteLabel,
              tagFilters
            })
              // The type tag filter is implicitly handled via the separate beaconType prop
              .filter(({ name }) => name !== 'beacon.type'),
            timeConfig,
            group,
            beaconType: beaconType,
            showGraph: true,
            metrics: metricsForAnalyze,
            focusedMetric,
            focusedMetricAggregation
          });
        }
      })
    ]
  };
}
