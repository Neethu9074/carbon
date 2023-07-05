/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Result, TagFilterExpression } from '@instana/types/typeDefinitions';
import { useObservable } from '@instana/hooks';

import getBizOpsEventsCount from 'in-bizops/subscriptions/getBizOpsEventsCount';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { MetricData } from 'in-custom-dashboards/widgets/Chart/types';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { getFormatter } from 'in-stores/metric/formatters';
import useTimeConfig from 'in-hooks/useTimeConfig';
import theme from 'in-themes';
import { t } from 'in-i18n';

interface InfraProps {
  businessProcessId: string;
  businessProcessName: string;
}

export default function InfrastructureIssuesAndChanges({ businessProcessId, businessProcessName }: InfraProps) {
  // get timeConfig, create filter for subscription
  const timeConfig = useTimeConfig();

  // Filter to specify the exact business process we want info from
  const tagFilterExpression: TagFilterExpression = {
    type: 'EXPRESSION',
    logicalOperator: 'AND',
    elements: [
      {
        name: 'bpm_process_definition_id',
        operator: 'EQUALS',
        stringValue: businessProcessId,
        entity: NOT_APPLICABLE,
        type: 'TAG_FILTER'
      },
      {
        name: 'bpm_process_definition_name',
        operator: 'EQUALS',
        stringValue: businessProcessName,
        entity: NOT_APPLICABLE,
        type: 'TAG_FILTER'
      }
    ]
  };

  // Initiate the subscription via an observable
  const bizopsEventCountResponse = useObservable(
    getBizOpsEventsCount({
      tagFilterExpression: tagFilterExpression,
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
        colors: [theme.lib.colors.pink800, '#9aa5a9', '#99e1e1', '#cdbcf0'],
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
