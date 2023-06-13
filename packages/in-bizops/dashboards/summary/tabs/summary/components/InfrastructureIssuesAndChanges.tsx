/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Result } from '@instana/types/typeDefinitions';
import { useObservable } from '@instana/hooks';

import getBizOpsEventsCount from 'in-bizops/subscriptions/getBizOpsEventsCount';
import { MetricData } from 'in-custom-dashboards/widgets/Chart/types';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { getFormatter } from 'in-stores/metric/formatters';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

interface InfraProps {
  businessProcessId: string;
}

export default function InfrastructureIssuesAndChanges({ businessProcessId }: InfraProps) {
  // get timeConfig, create filter for subscription
  const timeConfig = useTimeConfig();

  // intitiate the subscription via an observable
  const bizopsEventCountResponse = useObservable(
    getBizOpsEventsCount({
      processId: businessProcessId,
      granularity: getChartGranularity(timeConfig),
      filter: {
        timeConfig,
        includeInternalCalls: false,
        includeSyntheticCalls: false,
        useLongTermDataOnly: false
      }
    }),
    [businessProcessId, timeConfig]
  );

  // create the chart wrapper result from subscription data, or an empty one if necessary
  let chartWrapperResult: Result<MetricData>;
  if (bizopsEventCountResponse) {
    chartWrapperResult = {
      errors: bizopsEventCountResponse.data === null ? bizopsEventCountResponse.errors : [],
      progress: bizopsEventCountResponse.progress,
      data: bizopsEventCountResponse.data
        ? {
            ...(bizopsEventCountResponse.data.metrics as MetricData)
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

  // render the Infra chart using ChartWrapper
  return (
    <ChartWrapper
      title={t('in-bizops:dashboards.summary.widgets.infrastructureIssuesAndChanges')}
      result={chartWrapperResult}
      timeConfig={timeConfig}
      y1={{
        renderer: Renderer.stackedBar,
        labels: ['Infra Issues', 'Offline', 'Online', 'Changes'],
        metricIds: ['issues', 'offline', 'online', 'change'],
        colors: [],
        metrics: [],
        formatter: getFormatter('number.compact')
      }}
      metricsConfiguration={{
        metrics: {
          issues: {
            metric: 'issues',
            aggregation: 'DISTINCT_COUNT'
          },
          offline: {
            metric: 'offline',
            aggregation: 'DISTINCT_COUNT'
          },
          online: {
            metric: 'online',
            aggregation: 'DISTINCT_COUNT'
          },
          change: {
            metric: 'change',
            aggregation: 'DISTINCT_COUNT'
          }
        },
        companionMetrics: {}
      }}
    />
  );
}
