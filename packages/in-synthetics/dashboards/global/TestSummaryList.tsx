/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import {
  OrderDirection,
  Progress,
  SyntheticMetricConfiguration,
  TagFilter,
  TestResultListItem,
  TimeConfig
} from '@instana/types';

// @ts-expect-error
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { columnDefinitions } from 'in-synthetics/dashboards/global/tabs/tests/components/columnDefinitions';
// @ts-expect-error
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
// @ts-expect-error Module needs to be translated to TS
import Sticky from 'in-components/Sticky';
import { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import ViewSwitcher from 'in-synthetics/dashboards/global/tabs/tests/components/ViewSwitcher';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import TestConfigDialogPresenter from 'in-synthetics/components/TestConfigDialogPresenter';
import Filters from 'in-synthetics/dashboards/global/tabs/tests/components/Filters';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import getTestSummaryList from 'in-synthetics/subscriptions/getTestSummaryList';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { CONTAINS } from 'in-components/QueryBuilder/tagFilter/operators';
import FloatingActionButton from 'in-components/FloatingActionButton';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { getChartGranularity } from 'in-stores/metric/metric';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

const pathSegment = '/synthetics';
const matrixPrefix = '';

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions: columnDefinitions,
    title: t('in-synthetics:dashboard.noDataAvailable.testSummaryTitle'),
    description: t('in-synthetics:dashboard.noDataAvailable.testSummaryDescription')
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions: columnDefinitions,
  defaultOrderBy: 'test_name',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function TestSummaryList(props: ServerTablePresenterProps<TestResultListItem>) {
  const timeConfig = useTimeConfig();

  function reloadTests() {}

  function onAddWidget() {
    addActiveDialog(
      <TestConfigDialogPresenter
        onClose={() => {
          close();
        }}
        reloadTests={reloadTests}
      />
    );
  }

  const rightHeader = <Filters setFilter props={props} />;

  return (
    <Sticky header={<ViewSwitcher />}>
      <LeftRightPadding>
        <ViewTrackingMeta
          data={{
            productArea: 'Synthetic Monitoring',
            pageRootName: 'Synthetic Monitoring'
          }}
        />
        <ServerTableWithUrlState
          get={getTestSummaryListData}
          timeConfig={timeConfig}
          rightHeader={rightHeader}
          cardTitle={t('in-synthetics:dashboard.testList.secondaryLabels.tests')}
        />
      </LeftRightPadding>
      <Footer />

      <FloatingActionButtons>
        <FloatingActionButton onClick={onAddWidget} withBoxShadow icon="lib_line_chart">
          {t('in-synthetics:createTest.buttonLabel')}
        </FloatingActionButton>
      </FloatingActionButtons>
    </Sticky>
  );
}

type GetTestSummaryList = {
  timeConfig: TimeConfig;
  orderBy: string;
  orderDirection: OrderDirection;
  page: number;
  pageSize: number;
  query: string;
  progress: Progress;
};

function getTestSummaryListData({
  timeConfig,
  orderBy = 'test_name',
  orderDirection = 'ASC',
  page = 1,
  pageSize = 20,
  query = ''
}: GetTestSummaryList) {
  let baseTagFilters: TagFilter[] = [];
  if (query && query.length > 0) {
    baseTagFilters = [
      {
        stringValue: query,
        name: 'test_name',
        operator: CONTAINS,
        entity: NOT_APPLICABLE,
        type: 'TAG_FILTER'
      }
    ];
  }

  const sparkChartGranularity = getChartGranularity(timeConfig);

  const test_metric: SyntheticMetricConfiguration = {
    metric: 'response_time',
    granularity: sparkChartGranularity,
    aggregation: 'MEAN'
  };

  return getTestSummaryList({
    pagination: {
      page,
      pageSize
    },
    order: { by: orderBy, direction: orderDirection },
    metrics: {
      test: test_metric
    },
    filter: {
      timeConfig,
      includeInternalCalls: false,
      includeSyntheticCalls: false,
      useLongTermDataOnly: false
    },
    tagFilters: baseTagFilters
  });
}
