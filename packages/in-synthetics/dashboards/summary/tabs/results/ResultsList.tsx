/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import { useLocation } from 'react-router';
import { get } from 'lodash';
import moment from 'moment';
import React from 'react';

import { Link } from '@instana/components';
import { t } from '@instana/i18n-react';

// @ts-ignore
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-ignore
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import { timeByMillisZeroDecimalPlaces, kiloBytesTwoDecimalPlaces } from 'in-services/formatters/number';
// @ts-ignore
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { syntheticsDashboard, syntheticsSummaryPath } from 'in-synthetics/navigation/paths';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import getTestResultList from 'in-synthetics/subscriptions/getTestResultList';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { TagFilter, TimeConfig } from 'in-types';
import Footer from 'in-components/Footer/Footer';

import locals from 'in-synthetics/dashboards/summary/tabs/results/ResultsList.mless';

//import { TableEntityCounter } from '@instana/components';

const pathSegment = '/results';
const matrixPrefix = 'result.';
let testId = '';
const metrics = ['start_time', 'location_id', 'response_time', 'response_size'];

const columnDefinitions = [
  {
    id: 'start_time',
    label: t('in-synthetics:dashboard.resultsListPage.startedColumn'),
    isSortable: false,
    getContent(item: any) {
      const relativeTime = moment.unix(get(item, ['metrics', 'start_time', 0, 0], moment.now()) / 1000).fromNow();
      return <SeverityAwareEntityLink severity={5} icon="lib_synthetic" label={relativeTime} />;
    }
  },
  {
    id: 'location_id',
    label: t('in-synthetics:dashboard.resultsListPage.locationColumn'),
    getContent(item: any) {
      return (
        <Link
          href$={getModifiedUrlStream(summaryUrl => {
            summaryUrl.pathname = syntheticsSummaryPath;
            setOrDeleteMatrixKey(summaryUrl, syntheticsDashboard, 'testId', item.testResultCommonProperties.testId);
            return summaryUrl;
          })}
        >
          <h4>{item.testResultCommonProperties.locationId.split('_', 1)}</h4>
        </Link>
      );
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
};

function getSynthTableData({ timeConfig, orderBy = 'response_time', orderDirection = 'DESC' }: GetList) {
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
      page: 1,
      pageSize: 20
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
