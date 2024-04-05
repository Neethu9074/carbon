/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

import getBusinessProcess from 'in-bizops/subscriptions/getBusinessProcess';
import { carbonCategorical, chartColors } from 'in-themes/chartColors';
import { MetricData } from 'in-custom-dashboards/widgets/Chart/types';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { getFormatter } from 'in-stores/metric/formatters';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

interface ProcessLatencyChartProps {
  businessProcessId: string;
}

// This chart displays latency over time for a process
export default function ProcessLatencyChart({ businessProcessId }: ProcessLatencyChartProps) {
  const timeConfig = useTimeConfig();

  // initiate subscription to get process metrics data
  const chartGranularity = getChartGranularity(timeConfig);
  const processResponse = useObservable(
    getBusinessProcess({
      timeConfig: timeConfig,
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
      processDefinitionId: businessProcessId
    }),
    [timeConfig, businessProcessId]
  );

  // create chart wrapper result from subscription
  let chartWrapperResult: Result<MetricData>;
  if (processResponse) {
    chartWrapperResult = {
      errors: processResponse.data === null ? processResponse.errors : [],
      progress: processResponse.progress,
      data: processResponse.data
        ? {
            ...(processResponse.data.metrics as MetricData)
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
      title={t('in-bizops:dashboards.summary.widgets.processLatency')}
      result={chartWrapperResult}
      timeConfig={timeConfig}
      y1={{
        renderer: Renderer.line,
        labels: ['50th', '90th', '95th', '99th', 'Max', 'Mean'],
        metricIds: ['p50Latency', 'p90Latency', 'p95Latency', 'p99Latency', 'maxLatency', 'meanLatency'],
        formatter: getFormatter('number.compact'),
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
