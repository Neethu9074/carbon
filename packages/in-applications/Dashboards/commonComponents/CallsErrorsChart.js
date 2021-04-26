/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  createFormModelFromSyntheticOption,
  createHiddenCallsFromSyntheticOption
} from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { createChartedMetric, createMetricField } from 'in-analyze/navigation/paths';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { barOverlapping, line } from 'in-stores/metric/renderer';
import { getChartGranularity } from 'in-stores/metric/metric';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default function CallsErrorsChart({
  applicationId,
  serviceId,
  endpointId,
  tagFilters,
  timeConfig,
  timeShiftConfig,
  timeShiftMetric,
  syntheticCalls,
  groupBy,
  boundaryScope,
  cardTitle,
  renderPostChartContent
}) {
  const granularity = getChartGranularity(timeConfig);
  const throughputBlueprintConfig = getBlueprintConfig('throughput');
  const errorRateBlueprintConfig = getBlueprintConfig('errorRate');
  const hiddenCalls = createHiddenCallsFromSyntheticOption(syntheticCalls);

  const defaultMetricConfig = {
    granularity,
    aggregation: 'SUM',
    source: 'APPLICATION',
    tagFilters: tagFilters,
    timeConfig: timeConfig,
    timeShift: 0,
    ...hiddenCalls
  };

  const chartMetrics = [
    {
      config: defaultMetricConfig,
      id: 'calls.all',
      metric: 'calls',
      label: t('in-applications:labelCalls'),
      color: theme.lib.colors.chart.strokeColors25[0]
    },
    {
      config: defaultMetricConfig,
      id: 'erroneousCalls',
      metric: 'erroneousCalls',
      label: t('in-applications:titleErroneousCalls'),
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
          chartName: cardTitle ?? t('in-applications:labelCalls'),
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
            label: t('in-applications:lineViewInAnalyze'),
            getHref$: (highlightedTime, config) =>
              getJumpToAnalyzeHref$(
                { applicationId, serviceId, endpointId },
                {
                  timeConfig: highlightedTime,
                  boundaryScope,
                  groupBy,
                  formModel: createFormModelFromSyntheticOption(syntheticCalls),
                  hiddenCalls,
                  fields: [createMetricField('erroneousCalls', 'SUM'), createMetricField('latency', 'MEAN')],
                  chartedMetrics: getChartedMetrics(config)
                }
              )
          }
        ]
      }}
    />
  );
}

function getChartedMetrics(config) {
  return [createChartedMetric(config.renderedMetrics[0] === 'erroneousCalls' ? 'erroneousCalls' : 'calls', 'SUM')];
}
