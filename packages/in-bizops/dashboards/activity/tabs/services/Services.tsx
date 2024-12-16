/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Order, OrderDirection, TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error Module needs to be translated to TS
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import {
  businessActivityPath,
  businessActivityServiceListPath,
  businessProcessDashboard
} from 'in-bizops/navigation/paths';
import { servicesColumnDefinitions } from 'in-bizops/dashboards/activity/tabs/services/columnDefinitions';
import getActivityServices from 'in-bizops/subscriptions/getActivityServices';
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
  columnDefinitions: servicesColumnDefinitions,
  defaultOrderBy: 'bpm_activity_name',
  defaultOrderDirection: 'ASC',
  pathSegment: businessActivityServiceListPath,
  isSearchable: false
});

export default function Services() {
  const timeConfig = useTimeConfig();
  const location: Location = useLocation();
  const businessActivityId: string =
    getMatrixParameter(location, businessActivityPath, 'activityId') ?? t('in-bizops:dashboards.summary.pageTitle');
  const businessProcessDefinitionId: string =
    getMatrixParameter(location, businessProcessDashboard, 'definitionId') ?? '';

  return (
    <ServerTableWithUrlState
      cardTitle={t('in-bizops:dashboards.activity.servicesTab')}
      get={getBusinessProcessActivityList}
      // The props below are needed to be passed into getBusinessProcessActivityList
      businessActivityId={businessActivityId}
      businessProcessDefinitionId={businessProcessDefinitionId}
      timeConfig={timeConfig}
    />
  );
}

interface GetBusinessActivitiesListProps {
  businessActivityId: string;
  businessProcessDefinitionId: string;
  timeConfig: TimeConfig;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  order: Order;
  query: string;
}

function getBusinessProcessActivityList({
  businessActivityId,
  businessProcessDefinitionId,
  timeConfig,
  page = 1,
  pageSize = 20,
  orderBy = 'label',
  orderDirection = 'ASC'
}: GetBusinessActivitiesListProps) {
  return getActivityServices({
    activityId: businessActivityId,
    processDefinitionId: businessProcessDefinitionId,
    serviceMetrics: {
      latency: {
        metric: 'latency',
        aggregation: 'MEAN',
        granularity: 0
      },
      timeseries_latency: {
        metric: 'latency',
        aggregation: 'MEAN',
        granularity: getChartGranularity(timeConfig)
      },
      calls: {
        metric: 'calls',
        aggregation: 'SUM',
        granularity: 0
      },
      timeseries_calls: {
        metric: 'calls',
        aggregation: 'SUM',
        granularity: getChartGranularity(timeConfig)
      }
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    pagination: {
      page,
      pageSize
    },
    timeConfig
  });
}
