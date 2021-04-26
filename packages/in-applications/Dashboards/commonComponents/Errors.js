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
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { createChartedMetric, createMetricField } from 'in-analyze/navigation/paths';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { tagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { getChartGranularity } from 'in-stores/metric/metric';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { bar, line } from 'in-stores/metric/renderer';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default function Errors({
  timeConfig,
  endpointId,
  applicationId,
  serviceId,
  tagFilters,
  boundaryScope,
  cardTitle,
  syntheticCalls,
  groupBy,
  renderPostChartContent
}) {
  const granularity = getChartGranularity(timeConfig);
  const errorRateBlueprintConfig = getBlueprintConfig('errorRate');
  const timeShiftConfig = useTimeShiftConfig();

  const errorRate = {
    metric: 'errors',
    label: t('in-applications:titleErroneousCallRate'),
    aggregation: 'MEAN',
    source: 'APPLICATION',
    tagFilters: tagFilters,
    timeConfig: timeConfig,
    includeSynthetic: isSyntheticOption(syntheticCalls),
    granularity,
    timeShift: 0,
    color: theme.lib.colors.failure
  };

  let metrics;
  let renderer;
  let colors;
  if (timeShiftConfig.offset) {
    metrics = [
      {
        ...errorRate,
        timeShift: timeShiftConfig.offset
      },
      // make sure the main metric renders over the time shifted metric
      errorRate
    ];
    colors = [theme.lib.colors.timeShift, errorRate.color];
    renderer = line.id;
  } else {
    metrics = [errorRate];
    colors = [errorRate.color];
    renderer = bar.id;
  }

  return (
    <UnifiedMetricsChart
      renderPostChartContent={props =>
        renderPostChartContent({
          ...props,
          boundaryScope,
          chartName: cardTitle,
          alertRules: {
            errorRate: {
              rule: {
                alertType: errorRateBlueprintConfig.type,
                aggregation: errorRateBlueprintConfig.getAggregation(),
                metricName: errorRateBlueprintConfig.getMetricName()
              }
            }
          }
        })
      }
      title={cardTitle}
      automaticallySize={false}
      reverseLegendOrder={timeShiftConfig.offset}
      reverseTooltipOrder={timeShiftConfig.offset}
      config={{
        y1: {
          metrics: metrics,
          colors: colors,
          renderer: renderer,
          formatter: 'percentage.detailed'
        },
        y2: {
          metrics: []
        },
        type: 'TIME_SERIES',
        primaryContextMenuAction: 'analyze',
        additionalContextMenuButtons: [
          {
            name: 'analyze',
            icon: 'lib_analyze',
            label: t('in-applications:lineViewInAnalyze'),
            getHref$: highlightedTime =>
              getJumpToAnalyzeHref$(
                { applicationId, serviceId, endpointId },
                {
                  timeConfig: highlightedTime,
                  boundaryScope,
                  groupBy,
                  formModel: joinExpressions({
                    expressions: [
                      createFormModelFromSyntheticOption(syntheticCalls),
                      tagFilter('call.erroneous', EQUALS, true)
                    ]
                  }),
                  hiddenCalls: createHiddenCallsFromSyntheticOption(syntheticCalls),
                  fields: [createMetricField('errors', 'MEAN'), createMetricField('latency', 'MEAN')],
                  chartedMetrics: [createChartedMetric('errors', 'MEAN')]
                }
              )
          }
        ]
      }}
    />
  );
}
