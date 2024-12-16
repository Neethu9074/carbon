/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  OrderDirection,
  PaginatedResult,
  Result,
  BusinessProcess,
  TimeConfig,
  TagFilterExpression,
  TagFilterExpressionElementUnion
} from '@instana/types';
import { Observable } from '@instana/observables';

import getBusinessProcesses from 'in-bizops/subscriptions/getBusinessProcesses';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { getSparkChartGranularity } from 'in-applications/metrics';

/*
This is the default set of business process data used across the product. Typically if you
need to display a business process row, this is the subscription you would use.
*/

export interface GetBusinessProcessListDefaultProps {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  tagFilterExpressionElements?: TagFilterExpressionElementUnion[];
  timeConfig: TimeConfig;
  query?: string;
}

export default function getBusinessProcessesWithDefaults({
  //The value of query is from the Search box, by default, it is ''.
  page = 1,
  pageSize = 20,
  orderBy = 'process_name',
  orderDirection = 'ASC',
  timeConfig,
  query,
  tagFilterExpressionElements = []
}: GetBusinessProcessListDefaultProps): Observable<Result<PaginatedResult<BusinessProcess>>> {
  let tagFilterExpression: TagFilterExpression = {
    type: 'EXPRESSION',
    logicalOperator: 'AND',
    elements: []
  };

  // hide any entry with blank process name
  tagFilterExpression.elements.push({
    name: 'bpm_process_definition_name',
    operator: 'NOT_EQUAL',
    value: '',
    entity: NOT_APPLICABLE,
    type: 'TAG_FILTER'
  });

  // filter by user search against bpm_process_definition_name
  if (query && query.length > 0) {
    tagFilterExpression.elements.push({
      name: 'bpm_process_definition_name',
      operator: 'CONTAINS',
      stringValue: query,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    });
  }

  // Add any additional filters if exists
  tagFilterExpression.elements.push(...tagFilterExpressionElements);

  return getBusinessProcesses({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    dataType: 'PROCESS',
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
    timeConfig,
    tagFilterExpression
  });
}
