/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { BusinessProcessItem, Result, TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import connectTo from 'in-hoc/connectTo';
import getBusinessProcess from 'in-bizops/subscriptions/getBusinessProcess';
import ResultAwareKpiCard from 'in-components/KpiCard/ResultAwareKpiCard';
import { getChartGranularity } from 'in-stores/metric/metric';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

interface ProcessKpiProps {
  timeConfig: TimeConfig;
  processId: string;
}

interface KpiCardProps {
  title: string;
  result: Result<BusinessProcessItem>;
}

// This KPI Card will display process related data from the passed metric
export default connectTo(
  (props: ProcessKpiProps) => ({
    // create subscription to getBusinessProcess to retrieve the counts of this process
    result: getBusinessProcess({
      timeConfig: props.timeConfig,
      metrics: {
        started_processes: {
          metric: 'started_processes',
          granularity: getChartGranularity(props.timeConfig),
          aggregation: 'DISTINCT_COUNT'
        }
      },
      processDefinitionId: props.processId
    })
  }),
  // render the actual card using result data from subscription
  function ProcessMetricKpiCard({ title, result }: KpiCardProps) {
    return (
      <ResultAwareKpiCard
        title={title}
        result={result}
        renderKpiCard={result => {
          // the metric for started_processes looks like [[1707231540000,303.0]]
          const processInstancesCount = result?.data?.metrics.started_processes[0][1];

          return (
            <KpiCard
              title={title}
              value={processInstancesCount}
              companionValue={t('in-bizops:dashboards.summary.widgets.processCountTotal')}
            />
          );
        }}
      />
    );
  }
);
