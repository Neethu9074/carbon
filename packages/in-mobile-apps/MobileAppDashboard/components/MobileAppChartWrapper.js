/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { defaultGroupings, translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-mobile-apps/tags';
import { actionName, getButton } from 'in-components/Chart/actions/viewInAnalytics';
import getMobileAppMetrics from 'in-mobile-apps/subscriptions/getMobileAppMetrics';
import { extendMetricConfigurationOnLiveMode } from 'in-mobile-apps/metrics';
import { getLinkToAnalyze } from 'in-mobile-apps/navigation/paths';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { emptyObject } from 'in-services/fixedObjects';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    result: getMobileAppMetrics(extendMetricConfigurationOnLiveMode(props.metricsConfiguration))
  }),
  function MobileAppChartWrapper(props) {
    return <ChartWrapper {...props} {...getAdditionalChartActions(props)} />;
  }
);

function getAdditionalChartActions({ metricsConfiguration, viewInAnalytics }) {
  if (!viewInAnalytics || !viewInAnalytics.mobileAppLabel) {
    if (__DEV__) {
      throw new Error(
        'Incomplete chart configuration for mobile apps charts that causes "View in Analyze" to not be available.'
      );
    }
    return emptyObject;
  }

  const defaultBeaconType = determineDefaultBeaconType(metricsConfiguration);
  return {
    primaryContextMenuAction: actionName,
    additionalContextMenuButtons: [
      getButton({
        getHref$(timeConfig, { renderedMetrics }) {
          const beaconType =
            determineBeaconTypeBasedOnRenderedMetrics(renderedMetrics, metricsConfiguration) || defaultBeaconType;
          if (!beaconType) {
            return null;
          }

          const metrics = getMetrics(renderedMetrics, beaconType, metricsConfiguration);
          return getLinkToAnalyze({
            tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({
              mobileAppLabel: viewInAnalytics.mobileAppLabel,
              tagFilters: metricsConfiguration.tagFilters
            })
              // The type tag filter is implicitly handled via the separate beaconType prop
              .filter(({ name }) => name !== 'mobileBeacon.type'),
            timeConfig,
            group: viewInAnalytics.group || defaultGroupings[beaconType],
            beaconType,
            showGraph: true,
            metrics,
            focusedMetric: metrics[0]?.metric,
            focusedMetricAggregation: metrics[0]?.aggregation
          });
        }
      })
    ]
  };
}

function determineBeaconTypeBasedOnRenderedMetrics(renderedMetrics, metricsConfiguration) {
  for (const metricName of renderedMetrics) {
    const config = metricsConfiguration.metrics[metricName];
    if (config?.beaconType) {
      return config.beaconType;
    }
  }
}

function determineDefaultBeaconType(metricsConfiguration) {
  for (const metric of Object.values(metricsConfiguration.metrics)) {
    if (metric.beaconType) {
      return metric.beaconType;
    }
  }
}

function getMetrics(renderedMetrics, beaconType, metricsConfiguration) {
  return (
    renderedMetrics
      .map(chartMetricName => {
        const metricDefinition = metricsConfiguration.metrics[chartMetricName];
        if (beaconType !== metricDefinition?.beaconType || metricDefinition.omitMetricInAnalytics) {
          return;
        }
        return {
          metric: metricDefinition.analyzeMetricName || metricDefinition.metric,
          aggregation: metricDefinition.aggregation
        };
      })
      .filter(Boolean)
      // Render at most five additional metrics in analyze
      .slice(0, 5)
  );
}
