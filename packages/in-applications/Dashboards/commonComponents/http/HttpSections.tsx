/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  AggregationType,
  EndpointType,
  Group,
  TagFilter,
  TagFilterOperator,
  TimeConfig,
  TimeShift
} from '@instana/types';

import formModelFromHttpStatusRange, { TAG_CALL_HTTP_STATUS } from 'in-applications/analyze/utils/formModelUtils';
import UnifiedMetricsChart, { parseMetricId } from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { filterByEndpointType } from 'in-applications/Dashboards/commonComponents/includeEndpointTypes';
import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { or } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { IS_EMPTY, NOT_EMPTY } from 'in-components/QueryBuilder/tagFilter/operators';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { createChartedMetric } from 'in-analyze/navigation/paths';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { ChartedMetricsConfig } from 'in-components/Chart/types';
import { perSecondDetailed } from 'in-stores/metric/formatters';
import { timeShift, carbonAlert } from 'in-themes/chartColors';
import { getChartGranularity } from 'in-stores/metric/metric';
import { line, stackedBar } from 'in-stores/metric/renderer';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface HttpSectionsProps {
  applicationId: string;
  boundaryScope: string;
  cardTitle: string;
  endpointId: string;
  endpointTypes: EndpointType[];
  groupBy: Group;
  hasHttpAndOtherEndpoints: boolean;
  renderPostChartContentHttpStatus: (lanesProps: any) => JSX.Element;
  rightHeaderContent?: React.ReactElement;
  serviceId: string;
  tagFilters: (TagFilter | { name: string; operator: TagFilterOperator })[];
  timeConfig: TimeConfig;
  timeShiftConfig?: TimeShift;
  timeShiftMetric?: string;
  tableOpen?: boolean;
  tableCloseHandler?: Function;
}

export default function HttpSections({
  timeConfig,
  applicationId,
  serviceId,
  endpointId,
  tagFilters,
  boundaryScope,
  groupBy,
  renderPostChartContentHttpStatus,
  timeShiftConfig,
  timeShiftMetric,
  hasHttpAndOtherEndpoints,
  cardTitle,
  rightHeaderContent,
  endpointTypes,
  tableOpen,
  tableCloseHandler
}: HttpSectionsProps): JSX.Element {
  const granularity = getChartGranularity(timeConfig);
  const throughputBlueprintConfig = getBlueprintConfig('throughput');
  const errorsBlueprintConfig = getBlueprintConfig('errors');
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();
  const defaultMetricConfig = {
    granularity,
    aggregation: 'SUM' as AggregationType,
    source: 'APPLICATION',
    tagFilters: tagFilters,
    timeConfig: timeConfig,
    timeShift: 0
  };

  const otherCallsMetricConfig = {
    granularity,
    aggregation: 'SUM' as AggregationType,
    source: 'APPLICATION',
    tagFilters: [{ name: 'call.http.status', operator: IS_EMPTY }, ...tagFilters],
    timeConfig: timeConfig,
    timeShift: 0
  };

  const chartMetrics = [
    {
      config: defaultMetricConfig,
      metric: 'http.1xx',
      label: t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabel1XX'),
      color: carbonAlert.purple50
    },
    {
      config: defaultMetricConfig,
      metric: 'http.2xx',
      label: t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabel2XX'),
      color: carbonAlert.green50
    },
    {
      config: defaultMetricConfig,
      metric: 'http.3xx',
      label: t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabel3XX'),
      color: carbonAlert.blue70
    },
    {
      config: defaultMetricConfig,
      metric: 'http.4xx',
      label: t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabel4XX'),
      color: carbonAlert.orange40
    },
    {
      config: defaultMetricConfig,
      metric: 'http.5xx',
      label: t('in-websites:websiteDashboard.tabs.ajax.xhrRequestLabel5XX'),
      color: carbonAlert.red60
    }
  ];

  const companionMetricConfigs = [
    {
      ...defaultMetricConfig,
      metric: 'http.1xx',
      label: 'Calls per second',
      formatter: perSecondDetailed.formatter,
      aggregation: 'PER_SECOND'
    },
    {
      ...defaultMetricConfig,
      metric: 'http.2xx',
      label: 'Calls per second',
      formatter: perSecondDetailed.formatter,
      aggregation: 'PER_SECOND'
    },
    {
      ...defaultMetricConfig,
      metric: 'http.3xx',
      label: 'Calls per second',
      formatter: perSecondDetailed.formatter,
      aggregation: 'PER_SECOND'
    },
    {
      ...defaultMetricConfig,
      metric: 'http.4xx',
      label: 'Calls per second',
      formatter: perSecondDetailed.formatter,
      aggregation: 'PER_SECOND'
    },
    {
      ...defaultMetricConfig,
      metric: 'http.5xx',
      label: 'Calls per second',
      formatter: perSecondDetailed.formatter,
      aggregation: 'PER_SECOND'
    }
  ];

  if (hasHttpAndOtherEndpoints) {
    chartMetrics.push({
      config: otherCallsMetricConfig,
      metric: 'calls',
      label: t('in-applications:labelNonHttp'),
      color: '#9aa5a9'
    });
    companionMetricConfigs.push({
      ...otherCallsMetricConfig,
      metric: 'calls',
      label: 'Calls per second',
      formatter: perSecondDetailed.formatter,
      aggregation: 'PER_SECOND'
    });
  }

  let metricConfigs: Metric[];
  let renderer;
  let colors;
  if (timeShiftConfig?.offset) {
    const timeShiftChartMetric = chartMetrics.find(m => m.metric === timeShiftMetric) ?? chartMetrics[0];
    const timeShiftMetricConfig = {
      metric: timeShiftChartMetric.metric,
      label: timeShiftChartMetric.label,
      ...timeShiftChartMetric.config
    } as Metric;

    metricConfigs = [
      {
        ...timeShiftMetricConfig,
        timeShift: timeShiftConfig.offset
      },
      // make sure the main metric renders over the time shifted metric
      {
        ...timeShiftMetricConfig
      }
    ] as Metric[];
    colors = [timeShift, timeShiftChartMetric.color];
    renderer = line.id;
  } else {
    metricConfigs = chartMetrics.map(m => ({
      metric: m.metric,
      label: m.label,
      ...m.config
    })) as Metric[];
    colors = chartMetrics.map(m => m.color);
    renderer = stackedBar.id;
  }
  return (
    <UnifiedMetricsChart
      title={cardTitle}
      customChartSkeletonHeight={280}
      rightHeaderContent={rightHeaderContent}
      renderHistoricDataIndicator
      tableOpen={tableOpen}
      tableCloseHandler={tableCloseHandler}
      renderPostChartContent={props =>
        renderPostChartContentHttpStatus({
          ...props,
          boundaryScope,
          chartName: t('in-applications:labelCalls'),
          alertRules: {
            throughputHigh: {
              rule: {
                alertType: throughputBlueprintConfig.type,
                aggregation: throughputBlueprintConfig.getAggregation({ alertType: 'throughput', metricName: 'calls' }),
                metricName: throughputBlueprintConfig.getMetricName({ alertType: 'throughput', metricName: 'calls' })
              },
              seasonality: DAILY
            },
            throughputLow: {
              rule: {
                alertType: throughputBlueprintConfig.type,
                aggregation: throughputBlueprintConfig.getAggregation({ alertType: 'throughput', metricName: 'calls' }),
                metricName: throughputBlueprintConfig.getMetricName({ alertType: 'throughput', metricName: 'calls' })
              },
              seasonality: DAILY,
              operator: '<='
            },
            errorRate: {
              rule: {
                alertType: errorsBlueprintConfig.type,
                aggregation: 'MEAN',
                metricName: 'errors'
              }
            }
          }
        })
      }
      timeConfig={timeConfig}
      automaticallySize={false}
      reverseLegendOrder={timeShiftConfig?.offset !== 0}
      reverseTooltipOrder={timeShiftConfig?.offset !== 0}
      config={{
        y1: {
          metrics: metricConfigs,
          colors: colors,
          formatter: 'number.compact',
          tooltipFormatter: number.compact,
          renderer: renderer,
          companionMetricConfigs
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
            label: t('in-applications:lineViewInAnalyze'),
            getHref$: (highlightedTime: TimeConfig, metricsToAdd: ChartedMetricsConfig | undefined) =>
              getJumpToAnalyzeHref$(
                {
                  applicationId,
                  serviceId,
                  endpointId
                },
                {
                  boundaryScope,
                  dataSource: 'calls',
                  formModel: joinExpressions({
                    expressions: [
                      selectedMetricsToFormModel(
                        metricsToAdd ? metricsToAdd.renderedMetrics : [],
                        metricConfigs,
                        timeShiftConfig
                      ),
                      filterByEndpointType(endpointTypes)
                    ]
                  }),
                  groupBy,
                  timeConfig: highlightedTime,
                  chartedMetrics: [createChartedMetric('calls', 'SUM')]
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

function selectedMetricsToFormModel(renderedMetrics: string[], metricConfigs: Metric[], timeShiftConfig?: TimeShift) {
  if (timeShiftConfig?.offset) {
    if (metricConfigs[0].metric === 'calls') {
      return [tagFilter(TAG_CALL_HTTP_STATUS, IS_EMPTY)];
    }
    return formModelFromHttpStatusRange([getFirstStatusCodeDigit(metricConfigs[0].metric)]);
  }

  const activeMetrics = renderedMetrics.map((metricId: string) => metricConfigs[parseMetricId(metricId).index].metric);
  const activeNonHttp = activeMetrics.some((metric: string) => metric === 'calls');
  const includedHttpStatueRanges = activeMetrics
    .filter((metric: string) => metric != 'calls')
    .map((metric: string) => getFirstStatusCodeDigit(metric));
  if (includedHttpStatueRanges.length === 0) {
    // no http status ranges selected
    return activeNonHttp ? [tagFilter(TAG_CALL_HTTP_STATUS, IS_EMPTY)] : [];
  }
  if (includedHttpStatueRanges.length === 5) {
    // all http status ranges selected
    return activeNonHttp ? [] : [tagFilter(TAG_CALL_HTTP_STATUS, NOT_EMPTY)];
  }
  return joinExpressions({
    logicalOperator: or,
    expressions: [
      formModelFromHttpStatusRange(includedHttpStatueRanges),
      activeNonHttp ? tagFilter(TAG_CALL_HTTP_STATUS, IS_EMPTY) : []
    ]
  });
}

function getFirstStatusCodeDigit(metric: string) {
  switch (metric) {
    case 'http.1xx':
      return 1;
    case 'http.2xx':
      return 2;
    case 'http.3xx':
      return 3;
    case 'http.4xx':
      return 4;
    case 'http.5xx':
      return 5;
    default:
      return -1;
  }
}
