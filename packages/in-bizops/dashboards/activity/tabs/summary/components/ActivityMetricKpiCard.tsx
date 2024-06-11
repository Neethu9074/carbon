/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { BusinessActivityItem, PaginatedResult, Result, TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import connectTo from 'in-hoc/connectTo';
import getBusinessActivities from 'in-bizops/subscriptions/getBusinessActivities';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import ResultAwareKpiCard from 'in-components/KpiCard/ResultAwareKpiCard';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

interface ActivityKpiProps {
  timeConfig: TimeConfig;
  processId: string;
  activityName: string;
}

interface KpiCardProps {
  title: string;
  metric: 'COUNT' | 'ERRORS';
  result: Result<PaginatedResult<BusinessActivityItem>>;
}

// This KPI Card will display activity related data from the passed metric
export default connectTo(
  (props: ActivityKpiProps) => ({
    // create subscription to getBusinessActivities to retrieve the counts of this process
    result: getBusinessActivities({
      dataType: 'ACTIVITY',
      metrics: {
        activities_count: {
          metric: 'activities_count',
          granularity: 0,
          aggregation: 'DISTINCT_COUNT'
        },
        erroneous_call_count: {
          metric: 'erroneous_call_count',
          granularity: 0,
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
      timeConfig: props.timeConfig,
      tagFilterExpression: {
        logicalOperator: 'AND',
        type: 'EXPRESSION',
        elements: [
          {
            entity: NOT_APPLICABLE,
            name: 'bpm_process_definition_id',
            operator: 'EQUALS',
            value: props.processId,
            type: 'TAG_FILTER'
          },
          {
            name: 'bpm_activity_name',
            operator: 'CONTAINS',
            stringValue: props.activityName,
            entity: NOT_APPLICABLE,
            type: 'TAG_FILTER'
          }
        ]
      }
    })
  }),

  // render the actual card using result data from subscription
  function ActivityMetricKpiCard({ title, result, metric }: KpiCardProps) {
    return (
      <ResultAwareKpiCard
        title={title}
        result={result}
        renderKpiCard={result => {
          let kpiValue: number | undefined = undefined;
          if (metric === 'COUNT') {
            // need to get the corresponding activity from subscription.
            // if a backend method to get a single subscription is added,
            // this should be replaced with the single getter
            kpiValue = result?.data?.items?.[0] && result?.data?.items?.[0].metrics.activities_count[0][1];
          } else if (metric === 'ERRORS') {
            kpiValue = result?.data?.items?.[0] && result?.data?.items?.[0].metrics.erroneous_call_count[0][1];
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
