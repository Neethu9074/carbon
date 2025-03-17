/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

import getBusinessActivities from 'in-bizops/subscriptions/getBusinessActivities';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { MetricData } from 'in-custom-dashboards/widgets/Chart/types';
import { carbonAlert, chartColors } from 'in-themes/chartColors';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { getFormatter } from 'in-stores/metric/formatters';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

interface ActivityErrorsChartProps {
  processId: string;
  activityName: string;
}

// This chart displays errors over time for an activity
export default function ActivityErrorsChart({ processId, activityName }: ActivityErrorsChartProps) {
  const timeConfig = useTimeConfig();

  // initiate subscription to get activity metrics data
  const activityResponse = useObservable(
    getBusinessActivities({
      dataType: 'ACTIVITY',
      metrics: {
        erroneous_call_count: {
          metric: 'erroneous_call_count',
          granularity: getChartGranularity(timeConfig),
          aggregation: 'SUM'
        }
      },
      order: {
        by: 'activities_count',
        direction: 'DESC'
      },
      pagination: {
        page: 1,
        pageSize: 5
      },
      timeConfig: timeConfig,
      tagFilterExpression: {
        logicalOperator: 'AND',
        type: 'EXPRESSION',
        elements: [
          {
            entity: NOT_APPLICABLE,
            name: 'bpm_process_definition_id',
            operator: 'EQUALS',
            value: processId,
            type: 'TAG_FILTER'
          },
          {
            name: 'bpm_activity_name',
            operator: 'CONTAINS',
            stringValue: activityName,
            entity: NOT_APPLICABLE,
            type: 'TAG_FILTER'
          }
        ]
      }
    }),
    [timeConfig, processId, activityName]
  );

  // create chart wrapper result from subscription
  let chartWrapperResult: Result<MetricData>;
  if (activityResponse && activityResponse?.data?.items?.[0]) {
    chartWrapperResult = {
      errors: activityResponse.data === null ? activityResponse.errors : [],
      progress: activityResponse.progress,
      data: activityResponse?.data?.items
        ? {
            ...(activityResponse.data.items[0].metrics as MetricData)
          }
        : {}
    };
  } else {
    chartWrapperResult = {
      errors: [],
      progress: { loading: false },
      data: {}
    };
  }

  // render chart
  return (
    <ChartWrapper
      title={t('in-bizops:dashboards.activity.widgets.activityErrors')}
      result={chartWrapperResult}
      timeConfig={timeConfig}
      y1={{
        renderer: Renderer.line,
        labels: ['Errors'],
        metricIds: ['erroneous_call_count'],
        formatter: getFormatter('number.compact'),
        metrics: [],
        colors: [
          chartColors.threeColorPalette[0],
          carbonAlert.gray60,
          chartColors.threeColorPalette[1],
          chartColors.threeColorPalette[2]
        ]
      }}
      metricsConfiguration={{
        metrics: {
          erroneous_call_count: {
            metric: 'erroneous_call_count',
            aggregation: 'SUM'
          }
        },
        companionMetrics: {}
      }}
    />
  );
}
