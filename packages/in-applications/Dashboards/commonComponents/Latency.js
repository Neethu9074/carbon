import theme from 'in-themes';
import React from 'react';

import UnifiedMetricsChart, { parseMetricId } from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import { getChartGranularity } from 'in-applications/metrics';
import { latencyFixed } from 'in-services/formatters/number';
import { integral, line } from 'in-stores/metric/renderer';

export default function Latency({
  timeConfig,
  timeShiftConfig,
  endpointId,
  applicationId,
  serviceId,
  boundaryScope,
  cardTitle,
  isSynthetic,
  timeShiftAggregation,
  tagFilters,
  groupByTag,
  renderPostChartContent
}) {
  const granularity = getChartGranularity(timeConfig);
  const slownessBlueprintConfig = getBlueprintConfig('slowness');
  const aggregations = ['P90'];
  const alertRules = {};

  for (const aggregation of aggregations) {
    alertRules[`slowness_${aggregation}`] = {
      rule: {
        alertType: slownessBlueprintConfig.type,
        aggregation,
        metricName: slownessBlueprintConfig.getMetricName()
      },
      seasonality: 'DAILY'
    };
  }

  const defaultMetricConfig = {
    granularity,
    metric: 'latency',
    source: 'APPLICATION',
    tagFilters: tagFilters,
    timeConfig: timeConfig,
    timeShift: 0
  };

  const latencyMetrics = [
    {
      config: defaultMetricConfig,
      aggregation: 'P50',
      label: '50th',
      color: theme.lib.colors.chart.strokeColors25[0]
    },
    {
      config: defaultMetricConfig,
      aggregation: 'P90',
      label: '90th',
      color: theme.lib.colors.chart.strokeColors25[1]
    },
    {
      config: defaultMetricConfig,
      aggregation: 'P95',
      label: '95th',
      color: theme.lib.colors.chart.strokeColors25[2]
    },
    {
      config: defaultMetricConfig,
      aggregation: 'P99',
      label: '99th',
      color: theme.lib.colors.chart.strokeColors25[3]
    },
    {
      config: defaultMetricConfig,
      aggregation: 'MAX',
      label: 'Max',
      color: theme.lib.colors.chart.strokeColors25[4],
      defaultDisabled: !timeShiftConfig.offset
    },
    {
      config: defaultMetricConfig,
      aggregation: 'MEAN',
      label: 'Mean',
      color: theme.lib.colors.chart.strokeColors25[5],
      defaultDisabled: !timeShiftConfig.offset
    }
  ];

  let metricConfigs;
  let renderer;
  let colors;
  if (timeShiftConfig.offset) {
    const timeShiftChartMetric = latencyMetrics.find(m => m.aggregation === timeShiftAggregation) ?? latencyMetrics[0];
    const timeShiftMetricConfig = {
      label: timeShiftChartMetric.label,
      aggregation: timeShiftChartMetric.aggregation,
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
    metricConfigs = latencyMetrics.map(m => ({
      label: m.label,
      aggregation: m.aggregation,
      ...m.config
    }));
    colors = latencyMetrics.map(m => m.color);
    renderer = integral.id;
  }
  return (
    <UnifiedMetricsChart
      renderPostChartContent={props =>
        renderPostChartContent({
          chartName: cardTitle,
          alertRules,
          boundaryScope,
          ...props
        })
      }
      title={cardTitle}
      timeConfig={timeConfig}
      automaticallySize={false}
      reverseLegendOrder={timeShiftConfig.offset}
      reverseTooltipOrder
      shareMaxAxisDomain
      config={{
        y1: {
          renderer: renderer,
          formatter: 'millis.compact',
          tooltipFormatter: latencyFixed.compact,
          calculateStackDifferences: true,
          metrics: metricConfigs,
          colors: colors
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
            getHref$: (highlightedTime, metricsToAdd) =>
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
                  metrics: mapMetricsToAdd(metricsToAdd.renderedMetrics, metricConfigs, timeShiftConfig),
                  focusedMetric: focusBasedOnMetrics(metricsToAdd.renderedMetrics, metricConfigs, timeShiftConfig)
                }
              )
          }
        ]
      }}
    />
  );
}

function mapMetricsToAdd(renderedMetrics, metrics, timeShiftConfig) {
  const metricsForLink = [];
  if (timeShiftConfig.offset) {
    metricsForLink.push({ metric: 'latency', aggregation: metrics[0].aggregation });
  } else {
    const activeAggregations = renderedMetrics.map(metricId => metrics[parseMetricId(metricId).index].aggregation);
    activeAggregations.map(aggregation => {
      metricsForLink.push({ metric: 'latency', aggregation: aggregation });
    });
  }
  return metricsForLink;
}

function focusBasedOnMetrics(renderedMetrics, metrics, timeShiftConfig) {
  const metricsList = mapMetricsToAdd(renderedMetrics, metrics, timeShiftConfig);
  if (metricsList.length > 1 && metricsList[0].aggregation === 'P99' && metricsList[1].aggregation === 'MAX') {
    return `latency_MAX`;
  }
  return `latency_${metricsList[0].aggregation}`;
}
