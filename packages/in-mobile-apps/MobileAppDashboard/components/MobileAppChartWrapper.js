/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { defaultGroupings, translateDemocratisationTagFiltersToFormModel } from 'in-mobile-apps/tags';
import { actionName, getButton } from 'in-components/Chart/actions/viewInAnalytics';
import getMobileAppMetrics from 'in-mobile-apps/subscriptions/getMobileAppMetrics';
import { metric as metricType } from 'in-new-components/AnalyzeView/fieldTypes';
import { extendMetricConfigurationOnLiveMode } from 'in-mobile-apps/metrics';
import { getLinkToAnalyze } from 'in-mobile-apps/navigation/paths';
import useTagCatalog from 'in-mobile-apps/hooks/useTagCatalog';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { emptyObject } from 'in-services/fixedObjects';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    result: getMobileAppMetrics(extendMetricConfigurationOnLiveMode(props.metricsConfiguration))
  }),
  function MobileAppChartWrapper(props) {
    const tagCatalogs = {
      sessionStart: useTagCatalog('sessionStart'),
      viewChange: useTagCatalog('viewChange'),
      httpRequest: useTagCatalog('httpRequest'),
      custom: useTagCatalog('custom')
    };
    return <ChartWrapper {...props} {...getAdditionalChartActions({ ...props, tagCatalogs })} />;
  }
);

function getAdditionalChartActions({ metricsConfiguration, viewInAnalytics, tagCatalogs }) {
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
          return (
            tagCatalogs[beaconType] &&
            getLinkToAnalyze({
              formModel: translateDemocratisationTagFiltersToFormModel({
                mobileAppLabel: viewInAnalytics.mobileAppLabel,
                // The type tag filter is implicitly handled via the separate beaconType prop
                tagFilters: metricsConfiguration.tagFilters?.filter(({ name }) => name !== 'mobileBeacon.type'),
                tagCatalog: tagCatalogs[beaconType]
              }),
              timeConfig,
              groupBy: viewInAnalytics.group || defaultGroupings[beaconType],
              beaconType,
              fields: metrics,
              chartedMetrics:
                metrics?.length > 0
                  ? [
                      {
                        metricId: metrics[0].metricId,
                        aggregationId: metrics[0].aggregationId
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
          metricId: metricDefinition.analyzeMetricName || metricDefinition.metric,
          aggregationId: metricDefinition.aggregation,
          type: metricType
        };
      })
      .filter(Boolean)
      // Render at most five additional metrics in analyze
      .slice(0, 5)
  );
}
