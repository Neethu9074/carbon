/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import {
  createFormModelFromSyntheticOption,
  createHiddenCallsFromSyntheticOption,
  isSyntheticOption
} from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
import { createChartedMetric, createGroupBy, createOrderBy } from 'in-analyze/navigation/paths';
import { extendWindowSizeOnLiveMode, getResolvedTimeConfig } from 'in-applications/metrics';
import getTechnologyBreakdown from 'in-applications/subscriptions/getTechnologyBreakdown';
import { endpointNameTranslations, getColorChart } from 'in-applications/endpointTypes';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { NOT_EQUAL } from 'in-components/QueryBuilder/tagFilter/operators';
import { meanLatencyFixed, millis } from 'in-services/formatters/number';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { compareIgnoreCase } from 'in-services/util/string';
import { pendingResult } from 'in-services/fixedObjects';
import theme from 'in-themes';
import { t } from 'in-i18n';

function getTechnologyBreakdownObservable(parameters) {
  return getTechnologyBreakdown(parameters);
}

export default function TechnologyBreakdownPresenter({
  applicationId,
  serviceId,
  endpointId,
  timeConfig,
  boundaryScope,
  syntheticCalls,
  renderPostChartContent,
  renderHistoricDataIndicator,
  renderWidgetNotSupportedIndicator,
  disableChartInLive
}) {
  let config = {
    cardTitle: t('in-applications:titleProcessingTime')
  };

  const result =
    useObservable(() => {
      return getTechnologyBreakdownObservable({
        filter: {
          application: applicationId,
          endpoint: endpointId,
          applicationBoundaryScope: boundaryScope,
          timeConfig: extendWindowSizeOnLiveMode(timeConfig, true),
          includeSyntheticCalls: isSyntheticOption(syntheticCalls)
        },
        breakdownType: 'PROCESSING_TIME',
        granularity: getChartGranularity(timeConfig)
      });
    }, [timeConfig]) ?? pendingResult;
  if (result?.data) {
    const endpointTypes = Object.keys(result?.data).sort((a, b) => {
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
    const metrics = endpointTypes.map(type => result?.data[type]);
    const colors = endpointTypes.map(type => (type === 'SELF' ? theme.lib.colors.chart.self25 : getColorChart(type)));
    const hasApproximateData = result?.resultPrecisionDetails?.resultPrecision === 'PRECISION_APPROXIMATE';

    config = {
      disableChartInLive: disableChartInLive,
      renderPostChartContent,
      title: config.cardTitle,
      originalTimeConfig: timeConfig,
      timeConfig: getResolvedTimeConfig(
        {
          ...timeConfig,
          autoRefresh: false
        },
        result
      ),
      granularity: getChartGranularity(timeConfig),
      renderHistoricDataIndicator: renderHistoricDataIndicator,
      renderWidgetNotSupportedIndicator: renderWidgetNotSupportedIndicator,
      hasApproximateData,
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
      excludedContextMenuActions: timeConfig.autoRefresh ? ['globalHighlight'] : [],
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
                orderByGroups: createOrderBy('latency_MEAN', 'DESC'),
                chartedMetrics: [createChartedMetric('latency', 'MEAN')]
              }
            )
        }
      ]
    };
  }

  return (
    <ResultAwareChart
      result={result}
      config={config}
      resultPrecision={result?.resultPrecisionDetails?.resultPrecision}
    />
  );
}
function formModelBasedOnMetrics(labels, config) {
  return joinExpressions({
    expressions: labels
      .filter(metric => !config.renderedMetrics.includes(metric))
      .filter(metric => metric != 'Self')
      .map(metric => tagFilter('call.type', NOT_EQUAL, metric.toUpperCase()))
  });
}
