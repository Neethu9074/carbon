/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';
import { useState } from 'react';
import { find } from 'lodash';
import React from 'react';

import GroupMetricsChartPresenter, {
  getMetricKey
} from 'in-analyze/components/MetricsChart/GroupMetricsChartPresenter';
import getWebsiteBeaconGroups from 'in-websites/subscriptions/getWebsiteBeaconGroups';
import { actionName, getButton } from 'in-components/Chart/actions/viewInAnalytics';
import { translateDemocratisationTagFiltersToFormModel } from 'in-websites/tags';
import { metric as metricType } from 'in-new-components/AnalyzeView/fieldTypes';
import { emptyObject, pendingResult } from 'in-services/fixedObjects';
import { getLinkToAnalyze } from 'in-websites/navigation/paths';
import { getChartGranularity } from 'in-stores/metric/metric';
import useTagCatalog from 'in-websites/hooks/useTagCatalog';

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
export default function WebsiteBeaconGroupsChartWrapper(props) {
  const { tagFilters, timeConfig, group, metrics, retrievalSize, viewInAnalytics } = props;
  const result =
    useObservable(getWebsiteBeaconGroupsObservable, [tagFilters, timeConfig, group, metrics, retrievalSize]) ??
    pendingResult;
  const [selectedMetricKey, setSelectedMetricKey] = useState(null);
  const tagCatalogs = {
    pageLoad: useTagCatalog('pageLoad'),
    pageChange: useTagCatalog('pageChange'),
    resourceLoad: useTagCatalog('resourceLoad'),
    httpRequest: useTagCatalog('httpRequest'),
    error: useTagCatalog('error'),
    custom: useTagCatalog('custom')
  };

  return (
    <GroupMetricsChartPresenter
      {...props}
      result={result}
      selectedMetricKey={selectedMetricKey || getMetricKey(metrics[0])}
      setSelectedMetricKey={setSelectedMetricKey}
      selectedMetricDefinition={find(metrics, m => getMetricKey(m) === selectedMetricKey) || metrics[0]}
      {...getAdditionalChartActions(tagFilters, metrics, group, viewInAnalytics, selectedMetricKey, tagCatalogs)}
    />
  );
}

function getWebsiteBeaconGroupsObservable([tagFilters, timeConfig, group, metrics, retrievalSize]) {
  return getWebsiteBeaconGroups({
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
  });
}

function getAdditionalChartActions(tagFilters, metrics, group, viewInAnalytics, selectedMetricKey, tagCatalogs) {
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
            .map(({ metric, aggregation }) => ({
              metricId: metric,
              aggregationId: aggregation,
              type: metricType
            }))
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

          return (
            tagCatalogs[beaconType] &&
            getLinkToAnalyze({
              formModel: translateDemocratisationTagFiltersToFormModel({
                websiteLabel: viewInAnalytics.websiteLabel,
                // The type tag filter is implicitly handled via the separate beaconType prop
                tagFilters: tagFilters.filter(({ name }) => name !== 'beacon.type'),
                tagCatalog: tagCatalogs[beaconType]
              }),
              timeConfig,
              groupBy: group,
              beaconType: beaconType,
              fields: metricsForAnalyze,
              chartedMetrics:
                focusedMetric && focusedMetricAggregation
                  ? [
                      {
                        metricId: focusedMetric,
                        aggregationId: focusedMetricAggregation
                      }
                    ]
                  : []
            })
          );
        }
      })
    ]
  };
}
