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
import KpiCard from 'in-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

interface ProcessKpiProps {
  timeConfig: TimeConfig;
  processId: string;
}

interface KpiCardProps {
  title: string;
  metric: 'COUNT' | 'ERRORS';
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
          granularity: 0,
          aggregation: 'DISTINCT_COUNT'
        },
        erroneous_call_count: {
          metric: 'erroneous_call_count',
          granularity: 0,
          aggregation: 'SUM'
        }
      },
      processDefinitionId: props.processId
    })
  }),
  // render the actual card using result data from subscription
  function ProcessMetricKpiCard({ title, metric, result }: KpiCardProps) {
    return (
      <ResultAwareKpiCard
        title={title}
        result={result}
        renderKpiCard={result => {
          let kpiValue: number | undefined = undefined;
          if (metric === 'COUNT') {
            // the metric for started_processes looks like [[id, value]]
            kpiValue = result?.data?.metrics.started_processes[0][1];
          } else if (metric === 'ERRORS') {
            kpiValue = result?.data?.metrics.erroneous_call_count[0][1];
          }

          return (
            <KpiCard
              title={title}
              value={kpiValue}
              companionValue={t('in-bizops:dashboards.summary.widgets.processCountTotal')}
            />
          );
        }}
      />
    );
  }
);
