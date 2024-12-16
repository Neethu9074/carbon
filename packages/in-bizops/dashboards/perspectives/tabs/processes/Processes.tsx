/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { OrderDirection, TagFilterExpressionElementUnion, TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error Module needs to be translated to TS
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import getBusinessProcessesWithDefaults from 'in-bizops/subscriptions/helpers/getBusinessProcessesWithDefaults';
import { businessPerspectiveDashboard, businessPerspectiveSummaryPath } from 'in-bizops/navigation/paths';
import { processColumnDefinitions } from 'in-bizops/lists/businessProcess/columnDefinitions';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
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
  orderBy,
  orderDirection,
  page,
  pageSize,
  query = ''
}: GetBusinessProcessList) {
  const perspectiveId =
    getMatrixParameter(location, businessPerspectiveDashboard, 'perspectiveId') ??
    t('in-bizops:dashboards.summary.pageTitle');

  // filter the table based on the selected perspective
  const tagFilterExpressionElement: TagFilterExpressionElementUnion = {
    name: 'business.perspective.id',
    operator: 'EQUALS',
    stringValue: perspectiveId,
    entity: NOT_APPLICABLE,
    type: 'TAG_FILTER'
  };

  return getBusinessProcessesWithDefaults({
    timeConfig: timeConfig,
    query: query,
    tagFilterExpressionElements: [tagFilterExpressionElement],
    orderDirection,
    orderBy,
    page,
    pageSize
  });
}
