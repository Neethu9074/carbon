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
import { carbonCategorical, chartColors } from 'in-themes/chartColors';
import { MetricData } from 'in-custom-dashboards/widgets/Chart/types';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { millis } from 'in-services/formatters/number';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

interface ActivityLatencyChartProps {
  processId: string;
  activityName: string;
}

// This chart displays latency over time for an activity
export default function ActivityLatencyChart({ processId, activityName }: ActivityLatencyChartProps) {
  const timeConfig = useTimeConfig();

  // initiate subscription to get activity metrics data
  const chartGranularity = getChartGranularity(timeConfig);
  const activityResponse = useObservable(
    getBusinessActivities({
      dataType: 'ACTIVITY',
      metrics: {
        maxLatency: {
          metric: 'call_latency',
          granularity: chartGranularity,
          aggregation: 'MAX'
        },
        meanLatency: {
          metric: 'call_latency',
          granularity: chartGranularity,
          aggregation: 'MEAN'
        },
        p99Latency: {
          metric: 'call_latency',
          granularity: chartGranularity,
          aggregation: 'P99'
        },
        p95Latency: {
          metric: 'call_latency',
          granularity: chartGranularity,
          aggregation: 'P95'
        },
        p90Latency: {
          metric: 'call_latency',
          granularity: chartGranularity,
          aggregation: 'P90'
        },
        p50Latency: {
          metric: 'call_latency',
          granularity: chartGranularity,
          aggregation: 'P50'
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
            // @ts-expect-error TODO: need to refactor getBusinessActivities
            // to return a BusinessActivityItem for metrics
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
      title={t('in-bizops:dashboards.activity.widgets.activityLatency')}
      result={chartWrapperResult}
      timeConfig={timeConfig}
      y1={{
        renderer: Renderer.line,
        labels: ['50th', '90th', '95th', '99th', 'Max', 'Mean'],
        metricIds: ['p50Latency', 'p90Latency', 'p95Latency', 'p99Latency', 'maxLatency', 'meanLatency'],
        formatter: millis.fixedCompact,
        metrics: [],
        colors: [
          chartColors.fiveColorPalette[1],
          chartColors.fiveColorPalette[2],
          chartColors.fiveColorPalette[0],
          chartColors.fiveColorPalette[3],
          chartColors.fiveColorPalette[4],
          carbonCategorical.yellow50
        ]
      }}
      metricsConfiguration={{
        metrics: {
          maxLatency: {
            metric: 'call_latency',
            aggregation: 'MAX'
          },
          meanLatency: {
            metric: 'call_latency',
            aggregation: 'MEAN'
          },
          p99Latency: {
            metric: 'call_latency',
            aggregation: 'P99'
          },
          p95Latency: {
            metric: 'call_latency',
            aggregation: 'P95'
          },
          p90Latency: {
            metric: 'call_latency',
            aggregation: 'P90'
          },
          p50Latency: {
            metric: 'call_latency',
            aggregation: 'P50'
          }
        },
        companionMetrics: {}
      }}
    />
  );
}
