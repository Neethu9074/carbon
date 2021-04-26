/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  createFormModelFromSyntheticOption,
  createHiddenCallsFromSyntheticOption,
  isSyntheticOption
} from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
import getTechnologyBreakdown from 'in-applications/subscriptions/getTechnologyBreakdown';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import { endpointNameTranslations, getColorChart } from 'in-applications/endpointTypes';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { tagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { createChartedMetric, createGroupBy } from 'in-analyze/navigation/paths';
import { NOT_EQUAL } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { millis, meanLatencyFixed } from 'in-services/formatters/number';
import { extendWindowSizeOnLiveMode } from 'in-applications/metrics';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { getResolvedTimeConfig } from 'in-applications/metrics';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { compareIgnoreCase } from 'in-services/util/string';
import connectTo from 'in-hoc/connectTo';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default connectTo(
  ({ applicationId, serviceId, endpointId, boundaryScope, timeConfig, syntheticCalls }) => ({
    result: getTechnologyBreakdown({
      filter: {
        application: applicationId,
        service: serviceId,
        endpoint: endpointId,
        applicationBoundaryScope: boundaryScope,
        timeConfig: extendWindowSizeOnLiveMode(timeConfig),
        includeSyntheticCalls: isSyntheticOption(syntheticCalls)
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
    syntheticCalls,
    renderPostChartContent
  }) {
    let config = {
      cardTitle: t('in-applications:titleProcessingTime')
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
            label: t('in-applications:lineViewInAnalyze'),
            getHref$: (highlightedTime, config) =>
              getJumpToAnalyzeHref$(
                { applicationId, serviceId, endpointId },
                {
                  boundaryScope,
                  timeConfig: highlightedTime,
                  jumpToSource: endpointId ? 'endpoint' : serviceId ? 'service' : 'application',
                  formModel: joinExpressions({
                    expressions: [
                      createFormModelFromSyntheticOption(syntheticCalls),
                      formModelBasedOnMetrics(labels, config)
                    ]
                  }),
                  hiddenCalls: createHiddenCallsFromSyntheticOption(syntheticCalls),
                  groupBy: createGroupBy('call.type'),
                  chartedMetrics: [createChartedMetric('latency', 'MEAN')]
                }
              )
          }
        ]
      };
    }

    return <ResultAwareChart result={result} config={config} />;
  }
);

function formModelBasedOnMetrics(labels, config) {
  return joinExpressions({
    expressions: labels
      .filter(metric => !config.renderedMetrics.includes(metric))
      .filter(metric => metric != 'Self')
      .map(metric => tagFilter('call.type', NOT_EQUAL, metric.toUpperCase()))
  });
}
