import theme from 'in-themes';
import React from 'react';

import { getTimeShiftLabel, translateOffsetToTimeShiftConfig } from 'in-stores/time/shifting';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import { barOverlapping, line } from 'in-stores/metric/renderer';
import { getChartGranularity } from 'in-applications/metrics';

export default function CallsErrorsChart({
  applicationId,
  serviceId,
  endpointId,
  tagFilters,
  timeConfig,
  timeShiftConfig,
  timeShiftMetric,
  isSynthetic,
  groupByTag,
  boundaryScope,
  cardTitle,
  renderPostChartContent
}) {
  const granularity = getChartGranularity(timeConfig);
  const throughputBlueprintConfig = getBlueprintConfig('throughput');
  const errorRateBlueprintConfig = getBlueprintConfig('errorRate');

  const defaultMetricConfig = {
    granularity,
    aggregation: 'SUM',
    source: 'APPLICATION',
    tagFilters: tagFilters,
    timeConfig: timeConfig,
    timeShift: 0
  };

  const callsMetricConfig = {
    ...defaultMetricConfig,
    metric: 'calls',
    label: 'Calls',
    color: theme.lib.colors.chart.strokeColors25[0]
  };

  const erroneousCallsMetricConfig = {
    ...defaultMetricConfig,
    metric: 'erroneousCalls',
    label: 'Erroneous Calls',
    color: theme.lib.colors.failure
  };

  let metrics;
  let renderer;
  let colors;
  if (timeShiftConfig.offset) {
    const timeShiftMetricConfig = {
      ...(timeShiftMetric === 'calls' ? callsMetricConfig : erroneousCallsMetricConfig)
    };
    metrics = [
      {
        ...timeShiftMetricConfig,
        label: `${timeShiftMetricConfig.label} (${getTimeShiftLabel(
          translateOffsetToTimeShiftConfig(timeShiftConfig.offset, timeConfig)
        )})`,
        timeShift: timeShiftConfig.offset
      },
      // make sure the main metric renders over the time shifted metric
      {
        ...timeShiftMetricConfig
      }
    ];
    colors = [theme.lib.colors.timeShift, timeShiftMetricConfig.color];
    renderer = line.id;
  } else {
    metrics = [callsMetricConfig, erroneousCallsMetricConfig];
    colors = [callsMetricConfig.color, erroneousCallsMetricConfig.color];
    renderer = barOverlapping.id;
  }

  return (
    <UnifiedMetricsChart
      renderPostChartContent={props =>
        renderPostChartContent({
          ...props,
          boundaryScope,
          alertRules: {
            throughput: {
              rule: {
                alertType: throughputBlueprintConfig.type,
                aggregation: throughputBlueprintConfig.getAggregation(),
                metricName: throughputBlueprintConfig.getMetricName()
              },
              seasonality: 'DAILY',
              operator: throughputBlueprintConfig.thresholdDefaults.operator
            },
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
          reverseOrder: true,
          colors: colors,
          formatter: 'number.compact',
          renderer: renderer
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
            label: 'View in Analyze',
            getHref$: (highlightedTime, config) =>
              getJumpToAnalyzeHref$(
                { applicationId, serviceId, endpointId },
                {
                  timeConfig: highlightedTime,
                  boundaryScope,
                  groupByTag,
                  filters: isSynthetic
                    ? [
                        { name: 'call.is_synthetic', value: 'true' },
                        { name: 'include_synthetic', value: 'true' }
                      ]
                    : [],
                  metrics: [
                    { metric: 'erroneousCalls', aggregation: 'SUM' },
                    {
                      metric: 'latency',
                      aggregation: 'MEAN'
                    }
                  ],
                  focusedMetric: focusBasedOnMetrics(config)
                }
              )
          }
        ]
      }}
    />
  );
}

function focusBasedOnMetrics(config) {
  if (config.renderedMetrics[0] === 'erroneousCalls') {
    return 'erroneousCalls_SUM';
  }
  return 'calls_SUM';
}
