/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { MetricConfiguration, OrderDirection, TagFilterExpression, TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error Module needs to be translated to TS
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { businessPerspectiveDashboard, businessPerspectiveSummaryPath } from 'in-bizops/navigation/paths';
import { processColumnDefinitions } from 'in-bizops/lists/businessProcess/columnDefinitions';
import getBusinessProcessList from 'in-bizops/subscriptions/getBusinessProcessList';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { getChartGranularity } from 'in-stores/metric/metric';
import { Location } from 'in-stores/navigation/types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

const pathSegment = businessPerspectiveSummaryPath;
const matrixPrefix = '';

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions: processColumnDefinitions,
    title: t('in-bizops:lists.noData'),
    description: t('in-bizops:lists.noData')
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions: processColumnDefinitions,
  defaultOrderBy: 'process_name',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function Processes() {
  const timeConfig = useTimeConfig();
  const location = useLocation();

  const perspectiveName =
    getMatrixParameter(location, businessPerspectiveDashboard, 'perspectiveName') ??
    t('in-bizops:dashboards.summary.pageTitle');

  return (
    <ServerTableWithUrlState
      cardTitle={perspectiveName}
      get={getPerspectiveProcessListData}
      timeConfig={timeConfig}
      location={location}
    />
  );
}

type GetBusinessProcessList = {
  timeConfig: TimeConfig;
  location: Location;
  orderBy?: string;
  orderDirection?: OrderDirection;
  page: number;
  pageSize: number;
  query: string;
};

function getPerspectiveProcessListData({
  timeConfig,
  location,
  orderBy = 'process_name',
  orderDirection = 'ASC',
  page = 1,
  pageSize = 20,
  query = ''
}: GetBusinessProcessList) {
  const sparkChartGranularity = getChartGranularity(timeConfig);

  const started_processes_total: MetricConfiguration = {
    metric: 'started_processes',
    granularity: 0,
    aggregation: 'DISTINCT_COUNT'
  };

  const started_processes_array: MetricConfiguration = {
    metric: 'started_processes',
    granularity: sparkChartGranularity,
    aggregation: 'DISTINCT_COUNT'
  };

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

  //search against bpm_process_definition_name
  if (query && query.length > 0) {
    tagFilterExpression.elements.push({
      name: 'bpm_process_definition_name',
      operator: 'CONTAINS',
      stringValue: query,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    });
  }

  const perspectiveId =
    getMatrixParameter(location, businessPerspectiveDashboard, 'perspectiveId') ??
    t('in-bizops:dashboards.summary.pageTitle');

  // filter the table based on the selected perspective
  tagFilterExpression.elements.push({
    name: 'business.perspective.id',
    operator: 'EQUALS',
    stringValue: perspectiveId,
    entity: NOT_APPLICABLE,
    type: 'TAG_FILTER'
  });

  return getBusinessProcessList({
    pagination: {
      page,
      pageSize
    },
    order: { by: orderBy, direction: orderDirection },
    dataType: 'PROCESS',
    metrics: {
      started_processes_total: started_processes_total,
      started_processes_array: started_processes_array
    },
    timeConfig,
    tagFilterExpression
  });
}
