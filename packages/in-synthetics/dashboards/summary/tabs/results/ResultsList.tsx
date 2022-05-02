/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import { useLocation } from 'react-router';
import { get } from 'lodash';
import moment from 'moment';
import React from 'react';

import { t } from '@instana/i18n-react';

// @ts-ignore
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-ignore
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import { timeByMillisZeroDecimalPlaces, kiloBytesTwoDecimalPlaces } from 'in-services/formatters/number';
// @ts-ignore
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import getTestResultList from 'in-synthetics/subscriptions/getTestResultList';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { syntheticsDashboard } from 'in-synthetics/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { TagFilter, TimeConfig } from 'in-types';
import Footer from 'in-components/Footer/Footer';

import locals from 'in-synthetics/dashboards/summary/tabs/results/ResultsList.mless';

//import { TableEntityCounter } from '@instana/components';

const pathSegment = '/results';
const matrixPrefix = 'result.';
let testId = '';
const metrics = ['start_time', 'location_id', 'response_time', 'response_size', 'status'];

const columnDefinitions = [
  {
    id: 'start_time',
    label: t('in-synthetics:dashboard.resultsListPage.startedColumn'),
    isSortable: false,
    getContent(item: any) {
      return <SeverityAwareEntityLink severity={getSeverity(item)} label={getRelativeTime(item)} />;
    }
  },
  {
    id: 'location_id',
    label: t('in-synthetics:dashboard.resultsListPage.locationColumn'),
    getContent(item: any) {
      return <span className={locals.metricLabel}>{item.testResultCommonProperties.locationLabel}</span>;
    }
  },
  {
    id: 'response_time',
    label: t('in-synthetics:dashboard.resultsListPage.responseTimeColumn'),
    getContent(item: any) {
      const count = get(item, ['metrics', 'response_time', 0, 1], 0);
      return <span className={locals.metricLabel}>{timeByMillisZeroDecimalPlaces(count)}</span>;
    }
  },
  {
    id: 'response_size',
    label: t('in-synthetics:dashboard.resultsListPage.responseSizeColumn'),
    getContent(item: any) {
      const count = get(item, ['metrics', 'response_size', 0, 1], 0);
      return <span className={locals.metricLabel}>{kiloBytesTwoDecimalPlaces(count)}</span>;
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    title: t('in-synthetics:dashboard.noDataAvailable.resultsTitle'),
    description: t('in-synthetics:dashboard.noDataAvailable.resultsDescription')
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
  defaultOrderBy: 'response_time',
  defaultOrderDirection: 'DESC',
  pathSegment,
  matrixPrefix
});

export default function ResultsList() {
  const timeConfig = useTimeConfig();
  const location = useLocation();
  testId = getMatrixParameter(location, syntheticsDashboard, 'testId') ?? '';
  return (
    <>
      <ServerTableWithUrlState get={getSynthTableData} timeConfig={timeConfig} cardTitle={'Results'} />
      <Footer />
    </>
  );
}

type GetList = {
  timeConfig: TimeConfig;
  orderBy: any;
  orderDirection: any;
  page: number;
  pageSize: number;
};

function getSynthTableData({
  timeConfig,
  orderBy = 'response_time',
  orderDirection = 'DESC',
  page = 1,
  pageSize = 20
}: GetList) {
  let baseTagFilters: TagFilter[] = [
    {
      stringValue: testId,
      name: 'testId',
      operator: EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    }
  ];

  return getTestResultList({
    pagination: {
      page,
      pageSize
    },
    // @ts-ignore
    order: { by: orderBy, direction: orderDirection },
    // @ts-ignore
    syntheticMetrics: metrics,
    filter: {
      timeConfig,
      includeInternalCalls: false,
      includeSyntheticCalls: false,
      useLongTermDataOnly: false
    },
    // @ts-ignore
    tagFilters: baseTagFilters
  });
}

function getSeverity(item: any) {
  return getStatus(item) === 1 ? 0 : 10;
}

function getRelativeTime(item: any) {
  let status = getStatus(item);
  let date = get(item, ['metrics', 'start_time', 0, 0], moment.now()) / 1000;
  return status === 1 ? moment.unix(date).fromNow() : moment.unix(date).format('MMM Do YYYY, h:mm:ss a');
}

function getStatus(item: any) {
  return get(item, ['metrics', 'status', 0, 1], 0);
}
