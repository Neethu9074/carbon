/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  createFormModelFromSyntheticOption,
  createHiddenCallsFromSyntheticOption
} from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
import { filterByEndpointType } from 'in-applications/Dashboards/commonComponents/includeEndpointTypes';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { createChartedMetric, createMetricField } from 'in-analyze/navigation/paths';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { perSecondAggregationEnabled } from 'in-services/featureFlags';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { barOverlapping, line } from 'in-stores/metric/renderer';
import { perSecondDetailed } from 'in-stores/metric/formatters';
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
  renderPostChartContent,
  rightHeaderContent,
  endpointTypes
}) {
  const granularity = getChartGranularity(timeConfig);
  const throughputBlueprintConfig = getBlueprintConfig('throughput');
  const errorRateBlueprintConfig = getBlueprintConfig('errorRate');
  const hiddenCalls = createHiddenCallsFromSyntheticOption(syntheticCalls);

  const aggregation = perSecondAggregationEnabled ? 'PER_SECOND' : 'SUM';
  const formatter = perSecondAggregationEnabled ? 'perSecond.detailed' : 'number.compact';
  const callsLabel = perSecondAggregationEnabled
    ? t('in-applications:labelCallsPerSecondShort')
    : t('in-applications:labelCalls');
  const erroneousCallsLabel = perSecondAggregationEnabled
    ? t('in-applications:labelErroneousCallsPerSecondShort')
    : t('in-applications:titleErroneousCalls');

  const defaultMetricConfig = {
    granularity,
    aggregation,
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
      label: callsLabel,
      color: theme.lib.colors.chart.strokeColors25[0]
    },
    {
      config: defaultMetricConfig,
      id: 'erroneousCalls',
      metric: 'erroneousCalls',
      label: erroneousCallsLabel,
      color: theme.lib.colors.failure
    }
  ];

  const companionMetricConfigs = [
    {
      ...defaultMetricConfig,
      metric: 'calls',
      label: 'Calls per second',
      formatter: perSecondDetailed.formatter,
      aggregation: 'PER_SECOND'
    },
    {
      ...defaultMetricConfig,
      metric: 'erroneousCalls',
      label: 'Erroneous calls per second',
      formatter: perSecondDetailed.formatter,
      aggregation: 'PER_SECOND'
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
      title={cardTitle}
      customChartSkeletonHeight={262}
      rightHeaderContent={rightHeaderContent}
      renderHistoricDataIndicator
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
              seasonality: DAILY
            },
            throughputLow: {
              rule: {
                alertType: throughputBlueprintConfig.type,
                aggregation: throughputBlueprintConfig.getAggregation(),
                metricName: throughputBlueprintConfig.getMetricName()
              },
              seasonality: DAILY,
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
      automaticallySize={false}
      reverseLegendOrder={timeShiftConfig.offset}
      reverseTooltipOrder={timeShiftConfig.offset}
      config={{
        y1: {
          metrics: metricConfigs,
          reverseOrder: true,
          colors: colors,
          formatter,
          renderer: renderer,
          companionMetricConfigs
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
                  formModel: joinExpressions({
                    expressions: [
                      createFormModelFromSyntheticOption(syntheticCalls),
                      ...filterByEndpointType(endpointTypes)
                    ]
                  }),
                  hiddenCalls,
                  fields: [createMetricField('erroneousCalls', aggregation), createMetricField('latency', 'MEAN')],
                  chartedMetrics: getChartedMetrics(config, aggregation)
                }
              )
          }
        ]
      }}
    />
  );
}

function getChartedMetrics(config, aggregation) {
  return [
    createChartedMetric(config.renderedMetrics[0] === 'erroneousCalls' ? 'erroneousCalls' : 'calls', aggregation)
  ];
}
