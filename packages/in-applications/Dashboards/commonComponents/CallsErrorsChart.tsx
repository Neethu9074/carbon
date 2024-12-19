/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { TimeConfig, TagFilter, TimeShift, BoundaryScope, EndpointType, Group } from '@instana/types';

import { filterByEndpointType } from 'in-applications/Dashboards/commonComponents/includeEndpointTypes';
import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { AdditionChartContentProps, ChartedMetricsConfig } from 'in-components/Chart/types';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { createChartedMetric, createMetricField } from 'in-analyze/navigation/paths';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { carbonAlert, timeShift, chartColors } from 'in-themes/chartColors';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { barOverlapping, line } from 'in-stores/metric/renderer';
import { perSecondDetailed } from 'in-stores/metric/formatters';
import { getChartGranularity } from 'in-stores/metric/metric';
import { t } from 'in-i18n';

interface Props {
  applicationId?: string;
  serviceId?: string;
  endpointId?: string;
  tagFilters: TagFilter[];
  timeConfig: TimeConfig;
  timeShiftConfig?: TimeShift;
  timeShiftMetric?: string;
  groupBy: Group;
  boundaryScope?: BoundaryScope;
  cardTitle: string;
  renderPostChartContent: (props: AdditionChartContentProps) => React.ReactNode;
  rightHeaderContent?: React.ReactElement;
  endpointTypes?: EndpointType[];
  tableOpen?: boolean;
  tableCloseHandler?: Function;
}

export default function CallsErrorsChart({
  applicationId,
  serviceId,
  endpointId,
  tagFilters,
  timeConfig,
  timeShiftConfig,
  timeShiftMetric,
  groupBy,
  boundaryScope,
  cardTitle,
  renderPostChartContent,
  rightHeaderContent,
  endpointTypes,
  tableOpen,
  tableCloseHandler
}: Props) {
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();
  const granularity = getChartGranularity(timeConfig);

  const aggregation = 'SUM';
  const formatter = 'number.compact';
  const callsLabel = t('in-applications:labelCalls');
  const erroneousCallsLabel = t('in-applications:titleErroneousCalls');

  const defaultMetricConfig = {
    granularity,
    aggregation,
    source: 'APPLICATION',
    tagFilters: tagFilters,
    timeConfig: timeConfig,
    timeShift: 0
  } as const;

  const chartMetrics = [
    {
      config: defaultMetricConfig,
      id: 'calls.all',
      metric: 'calls',
      label: callsLabel,
      color: chartColors.strokeColors25[0]
    },
    {
      config: defaultMetricConfig,
      id: 'erroneousCalls',
      metric: 'erroneousCalls',
      label: erroneousCallsLabel,
      color: carbonAlert.red60
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
  if (timeShiftConfig?.offset) {
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
    colors = [timeShift, timeShiftChartMetric.color];
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
      tableOpen={tableOpen}
      tableCloseHandler={tableCloseHandler}
      title={cardTitle}
      customChartSkeletonHeight={280}
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
                alertType: 'throughput',
                aggregation: aggregation,
                metricName: 'calls'
              },
              seasonality: DAILY
            },
            throughputLow: {
              rule: {
                alertType: 'throughput',
                aggregation: aggregation,
                metricName: 'calls'
              },
              seasonality: DAILY,
              operator: '<='
            },
            errorCount: {
              rule: {
                alertType: 'errors',
                aggregation: 'MEAN',
                metricName: 'errors'
              }
            }
          }
        })
      }
      automaticallySize={false}
      reverseLegendOrder={timeShiftConfig?.offset !== 0}
      reverseTooltipOrder={timeShiftConfig?.offset !== 0}
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
            getHref$: (highlightedTime: TimeConfig, config: ChartedMetricsConfig | undefined) =>
              getJumpToAnalyzeHref$(
                { applicationId, serviceId, endpointId },
                {
                  timeConfig: highlightedTime,
                  boundaryScope,
                  groupBy,
                  formModel: filterByEndpointType(endpointTypes ? endpointTypes : []),
                  fields: [createMetricField('erroneousCalls', aggregation), createMetricField('latency', 'MEAN')],
                  chartedMetrics: getChartedMetrics(aggregation, config)
                },
                getLinkToApplicationAnalyze
              )
          }
        ]
      }}
      extendBar
    />
  );
}

function getChartedMetrics(aggregation: string, config?: ChartedMetricsConfig) {
  return [
    createChartedMetric(config?.renderedMetrics[0] === 'erroneousCalls' ? 'erroneousCalls' : 'calls', aggregation)
  ];
}
