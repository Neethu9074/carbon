/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import theme from 'in-themes';
import { t } from 'in-i18n';
import React from 'react';

import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { getChartGranularity } from 'in-stores/metric/metric';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { bar, line } from 'in-stores/metric/renderer';

export default function Errors({
  timeConfig,
  endpointId,
  applicationId,
  serviceId,
  tagFilters,
  boundaryScope,
  cardTitle,
  isSynthetic,
  groupByTag,
  renderPostChartContent
}) {
  const tagCatalog = useTagCatalog(getTagCatalog);
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
              tagCatalog &&
              getJumpToAnalyzeHref$(
                { applicationId, serviceId, endpointId },
                {
                  timeConfig: highlightedTime,
                  boundaryScope,
                  groupByTag,
                  filters: isSynthetic
                    ? [
                        { name: 'call.is_synthetic', value: 'true' },
                        { name: 'include_synthetic', value: 'true' },
                        { name: 'call.erroneous', value: 'true' }
                      ]
                    : [{ name: 'call.erroneous', value: 'true' }],
                  tagCatalog: tagCatalog,
                  metrics: [
                    { metric: 'errors', aggregation: 'MEAN' },
                    { metric: 'latency', aggregation: 'MEAN' }
                  ],
                  focusedMetric: 'errors_MEAN'
                }
              )
          }
        ]
      }}
    />
  );
}
