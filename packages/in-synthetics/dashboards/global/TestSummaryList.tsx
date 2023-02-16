/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { OrderDirection, Progress, SyntheticMetricConfiguration, TagFilter, TimeConfig } from '@instana/types';

import {
  CurrentState,
  FilterState,
  filterUrlStateDefinition,
  matrixPrefix,
  pathSegment,
  PresenterProps
} from 'in-synthetics/utils/constants';
// @ts-expect-error
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { columnDefinitions } from 'in-synthetics/dashboards/global/tabs/tests/components/columnDefinitions';
// @ts-expect-error
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { applicationIdTagName, locationIdTagName, testNameTagName, typeTagName } from 'in-synthetics/tags';
// @ts-expect-error Module needs to be translated to TS
import Sticky from 'in-components/Sticky';
import ViewSwitcher from 'in-synthetics/dashboards/global/tabs/tests/components/ViewSwitcher';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import TestConfigDialogPresenter from 'in-synthetics/components/TestConfigDialogPresenter';
import Filters from 'in-synthetics/dashboards/global/tabs/tests/components/Filters';
import { CONTAINS, EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import getTestSummaryList from 'in-synthetics/subscriptions/getTestSummaryList';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import FloatingActionButton from 'in-components/FloatingActionButton';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { getChartGranularity } from 'in-stores/metric/metric';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

const urlStateDefinition = {
  bind: filterUrlStateDefinition.bind,
  reducer: (prevState: FilterState, { syntheticTypes, locationIds, applicationIds }: CurrentState) => ({
    syntheticTypes: syntheticTypes || prevState.syntheticTypes,
    locationIds: locationIds || prevState.locationIds,
    applicationIds: applicationIds || prevState.applicationIds
  })
};

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions: columnDefinitions,
    title: t('in-synthetics:dashboard.noDataAvailable.testSummaryTitle'),
    description: t('in-synthetics:dashboard.noDataAvailable.testSummaryDescription')
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions: columnDefinitions,
  defaultOrderBy: 'successRate',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function TestSummaryList() {
  const timeConfig = useTimeConfig();
  const [{ syntheticTypes, locationIds, applicationIds }, setFilter] = useUrlState(urlStateDefinition);

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

  function useFilterHeader(isFilterAllowed: boolean) {
    return function Filter({ result, syntheticTypes, locationIds, applicationIds }: PresenterProps) {
      if (!isFilterAllowed) {
        return undefined;
      } else {
        return (
          <Filters
            result={result}
            setFilter={setFilter}
            syntheticTypes={syntheticTypes}
            locationIds={locationIds}
            applicationIds={applicationIds}
          />
        );
      }
    };
  }

  const rightHeader = useFilterHeader(true);

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
          syntheticTypes={syntheticTypes}
          locationIds={locationIds}
          applicationIds={applicationIds}
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
  context?: string;
  appId?: string;
  syntheticTypes?: string[];
  locationIds?: string[];
  applicationIds?: string[];
};

export function getTestSummaryListData({
  timeConfig,
  orderBy = 'successRate',
  orderDirection = 'ASC',
  page = 1,
  pageSize = 20,
  query = '',
  context = '',
  appId = '',
  syntheticTypes = [],
  locationIds = [],
  applicationIds = []
}: GetTestSummaryList) {
  let baseTagFilters: TagFilter[] = [];
  let byAppTagFilters: TagFilter[] = [];
  if (query && query.length > 0) {
    baseTagFilters = [
      {
        stringValue: query,
        name: testNameTagName,
        operator: CONTAINS,
        entity: NOT_APPLICABLE,
        type: 'TAG_FILTER'
      }
    ];
  }

  if (syntheticTypes.length !== 0 && Array.isArray(syntheticTypes)) {
    syntheticTypes.forEach(syntheticType => {
      baseTagFilters.push({
        value: syntheticType,
        name: typeTagName,
        operator: EQUALS,
        entity: NOT_APPLICABLE,
        type: 'TAG_FILTER'
      });
    });
  }

  if (locationIds.length !== 0 && Array.isArray(locationIds)) {
    locationIds.forEach(locationId => {
      baseTagFilters.push({
        value: locationId,
        name: locationIdTagName,
        operator: EQUALS,
        entity: NOT_APPLICABLE,
        type: 'TAG_FILTER'
      });
    });
  }

  if (applicationIds.length !== 0 && Array.isArray(applicationIds)) {
    applicationIds.forEach(applicationId => {
      baseTagFilters.push({
        value: applicationId,
        name: applicationIdTagName,
        operator: CONTAINS,
        entity: NOT_APPLICABLE,
        type: 'TAG_FILTER'
      });
    });
  }

  if (context == 'application') {
    byAppTagFilters = [
      {
        stringValue: appId,
        name: applicationIdTagName,
        operator: EQUALS,
        entity: NOT_APPLICABLE,
        type: 'TAG_FILTER'
      }
    ];

    if (syntheticTypes.length !== 0 && Array.isArray(syntheticTypes)) {
      syntheticTypes.forEach(syntheticType => {
        byAppTagFilters.push({
          value: syntheticType,
          name: typeTagName,
          operator: EQUALS,
          entity: NOT_APPLICABLE,
          type: 'TAG_FILTER'
        });
      });
    }

    if (locationIds.length !== 0 && Array.isArray(locationIds)) {
      locationIds.forEach(locationId => {
        byAppTagFilters.push({
          value: locationId,
          name: locationIdTagName,
          operator: EQUALS,
          entity: NOT_APPLICABLE,
          type: 'TAG_FILTER'
        });
      });
    }
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
    tagFilters: context == 'application' ? byAppTagFilters : baseTagFilters
  });
}
