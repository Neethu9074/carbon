/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import theme from 'in-themes';
import React from 'react';

import { IS_EMPTY, NOT_EMPTY, NOT_STARTS_WITH, STARTS_WITH } from 'in-new-components/QueryBuilder/tagFilter/operators';
import UnifiedMetricsChart, { parseMetricId } from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { getChartGranularity } from 'in-stores/metric/metric';
import { stackedBar, line } from 'in-stores/metric/renderer';
import { number } from 'in-services/formatters/number';

export default function HttpSections({
  timeConfig,
  applicationId,
  serviceId,
  endpointId,
  tagFilters,
  boundaryScope,
  filters,
  isSynthetic,
  groupByTag,
  metrics,
  renderPostChartContentHttpStatus,
  timeShiftConfig,
  timeShiftMetric,
  hasHttpAndOtherEndpoints
}) {
  const tagCatalog = useTagCatalog(getTagCatalog);
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

  const otherCallsMetricConfig = {
    granularity,
    aggregation: 'SUM',
    source: 'APPLICATION',
    tagFilters: [{ name: 'call.http.status', operator: IS_EMPTY }, ...tagFilters],
    timeConfig: timeConfig,
    timeShift: 0
  };

  const chartMetrics = [
    {
      config: defaultMetricConfig,
      metric: 'http.1xx',
      label: '1XX',
      color: theme.lib.colors.chart.strokeColors25[8]
    },
    {
      config: defaultMetricConfig,
      metric: 'http.2xx',
      label: '2XX',
      color: theme.lib.colors.chart.strokeColors25[1]
    },
    {
      config: defaultMetricConfig,
      metric: 'http.3xx',
      label: '3XX',
      color: theme.lib.colors.chart.strokeColors25[4]
    },
    {
      config: defaultMetricConfig,
      metric: 'http.4xx',
      label: '4XX',
      color: theme.lib.colors.warning
    },
    {
      config: defaultMetricConfig,
      metric: 'http.5xx',
      label: '5XX',
      color: theme.lib.colors.failure
    }
  ];

  if (hasHttpAndOtherEndpoints) {
    chartMetrics.push({
      config: otherCallsMetricConfig,
      metric: 'calls',
      label: 'Other',
      color: '#9aa5a9'
    });
  }

  let metricConfigs;
  let renderer;
  let colors;
  if (timeShiftConfig.offset) {
    const timeShiftChartMetric = chartMetrics.find(m => m.metric === timeShiftMetric) ?? chartMetrics[0];
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
    renderer = stackedBar.id;
  }

  return (
    <UnifiedMetricsChart
      renderPostChartContent={props =>
        renderPostChartContentHttpStatus({
          ...props,
          boundaryScope,
          chartName: 'Calls',
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
      timeConfig={timeConfig}
      automaticallySize={false}
      reverseLegendOrder={timeShiftConfig.offset}
      reverseTooltipOrder={timeShiftConfig.offset}
      config={{
        y1: {
          metrics: metricConfigs,
          colors: colors,
          formatter: 'number.compact',
          tooltipFormatter: number.compact,
          renderer: renderer
        },
        y2: {
          metrics: []
        },
        reverseOrder: true,
        type: 'TIME_SERIES',
        primaryContextMenuAction: 'analyze',
        additionalContextMenuButtons: [
          {
            name: 'analyze',
            icon: 'lib_analyze',
            label: 'View in Analyze',
            getHref$: (highlightedTime, metricsToAdd) =>
              tagCatalog &&
              getJumpToAnalyzeHref$(
                {
                  applicationId,
                  serviceId,
                  endpointId
                },
                {
                  boundaryScope,
                  dataSource: 'calls',
                  filters: isSynthetic
                    ? [
                        { name: 'call.is_synthetic', value: 'true' },
                        { name: 'include_synthetic', value: 'true' },
                        ...mapMetricsToAdd(filters, metricsToAdd.renderedMetrics, metricConfigs, timeShiftConfig)
                      ]
                    : [...mapMetricsToAdd(filters, metricsToAdd.renderedMetrics, metricConfigs, timeShiftConfig)],
                  tagCatalog: tagCatalog,
                  groupByTag: groupByTag ? groupByTag : {},
                  timeConfig: highlightedTime,
                  metrics: metrics ? metrics : null
                }
              )
          }
        ]
      }}
    />
  );
}

// Needs to add not rendered metrics to array
function mapMetricsToAdd(filters, renderedMetrics, metrics, timeShiftConfig) {
  const metricsForLink = filters ? [...filters] : [];
  if (timeShiftConfig.offset) {
    if (metrics[0].metric === 'calls') {
      metricsForLink.push({
        name: 'call.http.status',
        operator: IS_EMPTY
      });
    } else {
      metricsForLink.push({
        name: 'call.http.status',
        operator: STARTS_WITH,
        value: correctValue(metrics[0].metric)
      });
    }
  } else {
    const activeMetrics = renderedMetrics.map(metricId => metrics[parseMetricId(metricId).index].metric);
    const filteredArr = metrics.map(m => m.metric).filter(metric => !activeMetrics.includes(metric));
    filteredArr.map(metric => {
      if (metric === 'calls') {
        metricsForLink.push({
          name: 'call.http.status',
          operator: NOT_EMPTY
        });
      } else {
        metricsForLink.push({
          name: 'call.http.status',
          operator: NOT_STARTS_WITH,
          value: correctValue(metric)
        });
      }
    });
  }
  return metricsForLink;
}

function correctValue(metric) {
  switch (metric) {
    case 'http.1xx':
      return '1';
    case 'http.2xx':
      return '2';
    case 'http.3xx':
      return '3';
    case 'http.4xx':
      return '4';
    case 'http.5xx':
      return '5';
  }
}
