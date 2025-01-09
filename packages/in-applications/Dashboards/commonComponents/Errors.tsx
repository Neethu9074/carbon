/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { EndpointType, Granularity, Group, TagFilter, TimeConfig } from '@instana/types';

import { filterByEndpointType } from 'in-applications/Dashboards/commonComponents/includeEndpointTypes';
import { createChartedMetric, createMetricField, createOrderBy } from 'in-analyze/navigation/paths';
import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { carbonAlert, timeShift } from 'in-themes/chartColors';
import { getChartGranularity } from 'in-stores/metric/metric';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { bar, line } from 'in-stores/metric/renderer';
import { t } from 'in-i18n';

interface ErrorsProps {
  applicationId: string;
  boundaryScope: string;
  cardTitle: string;
  endpointId: string;
  endpointTypes: EndpointType[];
  groupBy: Group;
  renderPostChartContent: (a: any) => JSX.Element;
  serviceId: string;
  tagFilters: TagFilter;
  timeConfig: TimeConfig;
}

export default function Errors({
  timeConfig,
  endpointId,
  applicationId,
  serviceId,
  tagFilters,
  boundaryScope,
  cardTitle,
  endpointTypes,
  groupBy,
  renderPostChartContent
}: ErrorsProps): React.ReactElement {
  const granularity = getChartGranularity(timeConfig) as Granularity;
  const errorsBlueprintConfig = getBlueprintConfig('errors');
  const timeShiftConfig = useTimeShiftConfig();
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();
  const errorRate: Metric = {
    metric: 'errors',
    label: t('in-applications:titleErroneousCallRate'),
    aggregation: 'MEAN',
    source: 'APPLICATION',
    tagFilters: tagFilters,
    timeConfig: timeConfig,
    granularity,
    timeShift: 0,
    // eslint-disable-next-line import/no-deprecated
    color: carbonAlert.red60
  };

  let metrics: Metric[];
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
    // eslint-disable-next-line import/no-deprecated
    colors = [timeShift, errorRate.color];
    renderer = line.id;
  } else {
    metrics = [errorRate];
    colors = [errorRate.color];
    renderer = bar.id;
  }

  return (
    <UnifiedMetricsChart
      customChartSkeletonHeight={280}
      renderHistoricDataIndicator
      renderPostChartContent={props =>
        renderPostChartContent({
          ...props,
          boundaryScope,
          chartName: cardTitle,
          alertRules: {
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
      title={cardTitle}
      automaticallySize={false}
      reverseLegendOrder={timeShiftConfig.offset !== 0}
      reverseTooltipOrder={timeShiftConfig.offset !== 0}
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
                  orderByGroups: createOrderBy('errors_MEAN', 'DESC'),
                  formModel: filterByEndpointType(endpointTypes),
                  facets: { 'call.erroneous': [true] },
                  fields: [createMetricField('errors', 'MEAN'), createMetricField('latency', 'MEAN')],
                  chartedMetrics: [createChartedMetric('errors', 'MEAN')]
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
