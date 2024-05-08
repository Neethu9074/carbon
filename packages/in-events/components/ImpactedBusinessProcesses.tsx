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
// @ts-expect-error Module needs to be translated to TS
import { isServiceEntity } from 'in-services/entityUtils';
import { processColumnDefinitions } from 'in-bizops/lists/businessProcess/columnDefinitions';
import getBusinessProcessList from 'in-bizops/subscriptions/getBusinessProcessList';
import { EQUALS, NOT_EQUAL } from 'in-components/QueryBuilder/tagFilter/operators';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { businessProcessPath } from 'in-bizops/navigation/paths';
import { getChartGranularity } from 'in-stores/metric/metric';
import { Row, Col } from 'in-components/layout/Grid/Grid';
import { urlParameters } from 'in-stores/time/config';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { EVENT_TYPES } from 'in-stores/events';
import { t } from 'in-i18n';

interface ImpactedBusinessProcessesProps {
  eventType: number; // Used to determine the table card title
  entityType: string; // Used to check if entity is Service20. We only support showing IBPs for service impacts (currently at least)
  entityId: string; // The ID of the impacted entity
}

export default function ImpactedBusinessProcesses({ eventType, entityType, entityId }: ImpactedBusinessProcessesProps) {
  const timeConfig = useTimeConfig();

  // Don't display the table at all if there are no services impacted
  if (!isServiceEntity(entityType) || !entityId) {
    return null;
  }

  let cardTitle = '';
  if (eventType == EVENT_TYPES.INCIDENT) {
    cardTitle = t('in-events:bizops.titleImpactedBusinessProcessesIncident');
  } else {
    cardTitle = t('in-events:bizops.titleImpactedBusinessProcesses');
  }

  return (
    <Row withoutSideMargin>
      <Col xs>
        <ServerTableWithUrlState
          get={getBusinessProcessListData}
          timeConfig={timeConfig}
          serviceId={entityId}
          cardTitle={cardTitle}
        />
      </Col>
    </Row>
  );
}

const pathSegment = businessProcessPath;
const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions: processColumnDefinitions,
    title: t('in-bizops:lists.noData'),
    description: t('in-bizops:lists.noData')
  }),
  paginationResettingUrlParameters: [...urlParameters],
  columnDefinitions: processColumnDefinitions,
  defaultOrderBy: 'process_name',
  defaultOrderDirection: 'ASC',
  pathSegment
});

interface GetBusinessProcessListProps {
  timeConfig: TimeConfig;
  serviceId: string;
  orderBy?: string;
  orderDirection?: OrderDirection;
  page: number;
  pageSize: number;
  query: string;
}

export function getBusinessProcessListData({
  timeConfig,
  serviceId,
  orderBy = 'process_name',
  orderDirection = 'ASC',
  page = 1,
  pageSize = 20
}: GetBusinessProcessListProps) {
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
    operator: NOT_EQUAL,
    value: '',
    entity: NOT_APPLICABLE,
    type: 'TAG_FILTER'
  });

  tagFilterExpression.elements.push({
    name: 'service_id',
    operator: EQUALS,
    value: serviceId,
    entity: NOT_APPLICABLE,
    type: 'TAG_FILTER'
  });

  return getBusinessProcessList({
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
      started_processes_total: started_processes_total,
      started_processes_array: started_processes_array
    },
    timeConfig,
    tagFilterExpression
  });
}
