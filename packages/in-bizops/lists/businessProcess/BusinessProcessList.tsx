/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { MetricConfiguration, OrderDirection, TagFilterExpression, TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error Module needs to be translated to TS
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { processColumnDefinitions } from 'in-bizops/lists/businessProcess/columnDefinitions';
import getBusinessProcessList from 'in-bizops/subscriptions/getBusinessProcessList';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { businessProcessPath } from 'in-bizops/navigation/paths';
import { productAreas } from 'in-services/tracking/productAreas';
import { getChartGranularity } from 'in-stores/metric/metric';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import ViewSwitcher from 'in-bizops/components/ViewSwitcher';
import { pageNames } from 'in-services/tracking/pageNames';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

const pathSegment = businessProcessPath;
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

export default function BizOpsList() {
  const timeConfig = useTimeConfig();

  return (
    <Sticky header={<ViewSwitcher />}>
      <LeftRightPadding>
        <Title title={t('in-bizops:lists.pageTitle')} />
        <ViewTrackingMeta
          data={{
            productArea: productAreas.bizops,
            pageRootName: pageNames.bizops_processes
          }}
        />
        <ServerTableWithUrlState
          get={getBusinessProcessListData}
          timeConfig={timeConfig}
          cardTitle={t('in-bizops:lists.cardTitle')}
        />
      </LeftRightPadding>
      <Footer />
    </Sticky>
  );
}

type GetBusinessProcessList = {
  timeConfig: TimeConfig;
  orderBy?: string;
  orderDirection?: OrderDirection;
  page: number;
  pageSize: number;
  query: string;
};

export function getBusinessProcessListData({
  timeConfig,
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
