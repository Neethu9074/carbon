/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Result, TimeConfig, BusinessProcessItem } from '@instana/types';
import { Observable } from '@instana/observables';

import getBusinessProcess from 'in-bizops/subscriptions/getBusinessProcess';
import { getSparkChartGranularity } from 'in-applications/metrics';

/**
 * Returns a single business process
 */

export interface GetBusinessProcessWithDefaultProps {
  timeConfig: TimeConfig;
  processDefinitionId: string;
}

export default function getBusinessProcessWithDefaults({
  timeConfig,
  processDefinitionId
}: GetBusinessProcessWithDefaultProps): Observable<Result<BusinessProcessItem>> {
  return getBusinessProcess({
    metrics: {
      started_processes_array: {
        metric: 'started_processes',
        granularity: getSparkChartGranularity(timeConfig),
        aggregation: 'DISTINCT_COUNT'
      },
      started_processes_total: {
        metric: 'started_processes',
        granularity: 0,
        aggregation: 'DISTINCT_COUNT'
      },
      activities_count: {
        metric: 'activity_count_distinct',
        granularity: 0,
        aggregation: 'DISTINCT_COUNT'
      },
      openIssues: {
        metric: 'openIssues',
        aggregation: 'DISTINCT_COUNT'
      },
      maxSeverity: {
        metric: 'maxSeverity',
        aggregation: 'MAX'
      }
    },
    processDefinitionId,
    timeConfig
  });
}
