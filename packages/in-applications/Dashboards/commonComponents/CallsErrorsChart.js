import theme from 'in-themes';
import React from 'react';

import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import { barOverlapping, line } from 'in-stores/metric/renderer';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
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
  const tagCatalog = useTagCatalog(getTagCatalog);

  const defaultMetricConfig = {
    granularity,
    aggregation: 'SUM',
    source: 'APPLICATION',
    tagFilters: tagFilters,
    timeConfig: timeConfig,
    timeShift: 0
  };

  const chartMetrics = [
    {
      config: defaultMetricConfig,
      id: 'calls.all',
      metric: 'calls',
      label: 'Calls',
      color: theme.lib.colors.chart.strokeColors25[0]
    },
    {
      config: defaultMetricConfig,
      id: 'erroneousCalls',
      metric: 'erroneousCalls',
      label: 'Erroneous Calls',
      color: theme.lib.colors.failure
    }
  ];

  let metricConfigs;
  let renderer;
  let colors;
  if (timeShiftConfig.offset) {
    const timeShiftChartMetric = chartMetrics.find(m => m.id === timeShiftMetric) ?? chartMetrics[0];
    const timeShiftMetricConfig = {
      metric: timeShiftChartMetric.metric,
      label: timeShiftChartMetric.label,
      ...timeShiftChartMetric.config
    };
    metricConfigs = [
      {
        ...timeShiftMetricConfig,
        timeShift: timeShiftConfig.offset
      },
      // make sure the main metric renders over the time shifted metric
      {
        ...timeShiftMetricConfig
      }
    ];
    colors = [theme.lib.colors.timeShift, timeShiftChartMetric.color];
    renderer = line.id;
  } else {
    metricConfigs = chartMetrics.map(m => ({
      metric: m.metric,
      label: m.label,
      ...m.config
    }));
    colors = chartMetrics.map(m => m.color);
    renderer = barOverlapping.id;
  }

  return (
    <UnifiedMetricsChart
      renderPostChartContent={props =>
        renderPostChartContent({
          ...props,
          boundaryScope,
          chartName: cardTitle ?? 'Calls',
          alertRules: {
            throughputHigh: {
              rule: {
                alertType: throughputBlueprintConfig.type,
                aggregation: throughputBlueprintConfig.getAggregation(),
                metricName: throughputBlueprintConfig.getMetricName()
              },
              seasonality: 'DAILY'
            },
            throughputLow: {
              rule: {
                alertType: throughputBlueprintConfig.type,
                aggregation: throughputBlueprintConfig.getAggregation(),
                metricName: throughputBlueprintConfig.getMetricName()
              },
              seasonality: 'DAILY',
              operator: '<='
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
          metrics: metricConfigs,
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
                        { name: 'include_synthetic', value: 'true' }
                      ]
                    : [],
                  tagCatalog: tagCatalog,
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
