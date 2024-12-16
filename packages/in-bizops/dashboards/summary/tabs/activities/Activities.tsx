/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Order, OrderDirection, TagFilterExpression, TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error Module needs to be translated to TS
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { activitiesColumnDefinitions } from 'in-bizops/dashboards/summary/tabs/activities/columnDefinitions';
import { businessProcessActivityListPath, businessProcessDashboard } from 'in-bizops/navigation/paths';
import getBusinessActivities from 'in-bizops/subscriptions/getBusinessActivities';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { getChartGranularity } from 'in-stores/metric/metric';
import { Location } from 'in-stores/navigation/types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    title: t('in-bizops:lists.noData'),
    description: t('in-bizops:lists.noData')
  }),
  columnDefinitions: activitiesColumnDefinitions,
  defaultOrderBy: 'bpm_activity_name',
  defaultOrderDirection: 'ASC',
  pathSegment: businessProcessActivityListPath
});

export default function Activities() {
  const timeConfig = useTimeConfig();
  const location: Location = useLocation();
  const businessProcessId: string =
    getMatrixParameter(location, businessProcessDashboard, 'definitionId') ??
    t('in-bizops:dashboards.summary.pageTitle');

  return (
    <ServerTableWithUrlState
      cardTitle={t('in-bizops:dashboards.summary.activitiesTab')}
      get={getBusinessProcessActivityList}
      // The props below are needed to be passed into getBusinessProcessActivityList
      businessProcessId={businessProcessId}
      timeConfig={timeConfig}
    />
  );
}

interface GetBusinessActivitiesListProps {
  businessProcessId: string;
  timeConfig: TimeConfig;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  order: Order;
  query: string;
}

function getBusinessProcessActivityList({
  businessProcessId,
  timeConfig,
  page = 1,
  pageSize = 20,
  orderBy = 'bpm_activity_name',
  orderDirection = 'ASC',
  query = ''
}: GetBusinessActivitiesListProps) {
  const tagFilterExpression: TagFilterExpression = {
    logicalOperator: 'AND',
    type: 'EXPRESSION',
    elements: [
      {
        entity: NOT_APPLICABLE,
        name: 'bpm_process_definition_id',
        operator: 'EQUALS',
        value: businessProcessId,
        type: 'TAG_FILTER'
      }
    ]
  };

  // Further filtering for search box
  if (query && query.length > 0) {
    tagFilterExpression.elements.push({
      name: 'bpm_activity_name',
      operator: 'CONTAINS',
      stringValue: query,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    });
  }

  return getBusinessActivities({
    dataType: 'ACTIVITY',
    metrics: {
      count: {
        metric: 'activities_count',
        aggregation: 'DISTINCT_COUNT',
        granularity: 0
      },
      timeseries_counts: {
        metric: 'activities_count',
        aggregation: 'DISTINCT_COUNT',
        granularity: getChartGranularity(timeConfig)
      },
      duration: {
        metric: 'activityDuration',
        aggregation: 'MEAN',
        granularity: 0
      },
      timeseries_duration: {
        metric: 'activityDuration',
        aggregation: 'MEAN',
        granularity: getChartGranularity(timeConfig)
      },
      call_latency: {
        metric: 'call_latency',
        aggregation: 'MEAN',
        granularity: 0
      },
      timeseries_latency: {
        metric: 'call_latency',
        aggregation: 'MEAN',
        granularity: getChartGranularity(timeConfig)
      }
    },
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    timeConfig,
    tagFilterExpression
  });
}
