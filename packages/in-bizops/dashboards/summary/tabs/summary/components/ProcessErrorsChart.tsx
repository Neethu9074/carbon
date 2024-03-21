/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

import getBusinessProcess from 'in-bizops/subscriptions/getBusinessProcess';
import { MetricData } from 'in-custom-dashboards/widgets/Chart/types';
import { carbonAlert, chartColors } from 'in-themes/chartColors';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { getFormatter } from 'in-stores/metric/formatters';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

interface ProcessErrorsChartProps {
  businessProcessId: string;
}

// This chart displays errors over time for a process or activity
export default function ProcessErrorsChart({ businessProcessId }: ProcessErrorsChartProps) {
  const timeConfig = useTimeConfig();

  // initiate subscription to get process metrics data
  const processResponse = useObservable(
    getBusinessProcess({
      timeConfig: timeConfig,
      metrics: {
        errors: {
          metric: 'erroneous_call_count',
          granularity: getChartGranularity(timeConfig),
          aggregation: 'SUM'
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
      title={t('in-bizops:dashboards.summary.widgets.processErrors')}
      result={chartWrapperResult}
      timeConfig={timeConfig}
      y1={{
        renderer: Renderer.line,
        labels: ['Errors'],
        metricIds: ['errors'],
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
          errors: {
            metric: 'errors',
            aggregation: 'SUM'
          }
        },
        companionMetrics: {}
      }}
    />
  );
}
