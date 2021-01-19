/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import theme from 'in-themes';
import React from 'react';

import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import getTechnologyBreakdown from 'in-applications/subscriptions/getTechnologyBreakdown';
import { endpointNameTranslations, getColorChart } from 'in-applications/endpointTypes';
import { getChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { millis, meanLatencyFixed } from 'in-services/formatters/number';
import { extendWindowSizeOnLiveMode } from 'in-applications/metrics';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { compareIgnoreCase } from 'in-services/util/string';
import { entityTypes } from 'in-analyze/applicationFilter';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ applicationId, serviceId, endpointId, boundaryScope, timeConfig }) => ({
    result: getTechnologyBreakdown({
      filter: {
        application: applicationId,
        service: serviceId,
        endpoint: endpointId,
        applicationBoundaryScope: boundaryScope,
        timeConfig: extendWindowSizeOnLiveMode(timeConfig)
      },
      breakdownType: 'PROCESSING_TIME',
      granularity: getChartGranularity(timeConfig)
    })
  }),
  function TechnologyBreakdownPresenter({
    applicationId,
    serviceId,
    endpointId,
    timeConfig,
    result,
    boundaryScope,
    isSynthetic,
    renderPostChartContent
  }) {
    const tagCatalog = useTagCatalog(getTagCatalog);
    let config = {
      cardTitle: 'Processing Time'
    };
    if (result.data) {
      const endpointTypes = Object.keys(result.data).sort((a, b) => {
        // move SELF time to the bottom of the chart
        if (a === 'SELF') {
          return -1;
        } else if (b === 'SELF') {
          return 1;
        }
        return compareIgnoreCase(a, b);
      });
      const labels = endpointTypes.map(type => endpointNameTranslations[type]);
      const metricIds = endpointTypes.map(type => endpointNameTranslations[type]);
      const metrics = endpointTypes.map(type => result.data[type]);
      const colors = endpointTypes.map(type => (type === 'SELF' ? theme.lib.colors.chart.self25 : getColorChart(type)));

      config = {
        renderPostChartContent,
        cardTitle: config.cardTitle,
        originalTimeConfig: timeConfig,
        timeConfig: getResolvedTimeConfig(timeConfig, result),
        granularity: getChartGranularity(timeConfig),
        y1: {
          renderer: Renderer.stackedArea,
          labels,
          metrics,
          colors,
          metricIds,
          formatter: millis.forcedFixedCompact,
          tooltipFormatter: meanLatencyFixed.compact,
          min: 0
        },
        primaryContextMenuAction: 'analyze',
        additionalContextMenuButtons: [
          {
            name: 'analyze',
            icon: 'lib_analyze',
            label: 'View in Analyze',
            getHref$: (highlightedTime, config) =>
              tagCatalog &&
              getJumpToAnalyzeHref$(
                { applicationId, serviceId, endpointId },
                {
                  boundaryScope,
                  timeConfig: highlightedTime,
                  showGraph: true,
                  jumpToSource: endpointId ? 'endpoint' : serviceId ? 'service' : 'application',
                  filters: isSynthetic
                    ? [
                        { name: 'call.is_synthetic', value: 'true' },
                        { name: 'include_synthetic', value: 'true' }
                      ]
                    : filtersBasedOnMetrics(labels, config),
                  tagCatalog: tagCatalog,
                  groupByTag: { name: 'call.type', entity: entityTypes.NOT_APPLICABLE },
                  focusedMetric: 'latency_MEAN'
                }
              )
          }
        ]
      };
    }

    return <ResultAwareChart result={result} config={config} />;
  }
);

function filtersBasedOnMetrics(labels, config) {
  return labels
    .filter(metric => config.renderedMetrics.indexOf(metric) == -1)
    .filter(metric => metric != 'Self')
    .map(metric => ({
      name: 'call.type',
      secondLevelName: false,
      value: metric.toUpperCase(),
      operator: 'NOT_EQUAL',
      entity: 'NOT_APPLICABLE'
    }));
}
