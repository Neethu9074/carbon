/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useEffect } from 'react';

import {
  OrderDirection,
  Progress,
  Result,
  SyntheticMetricConfiguration,
  SyntheticTest,
  TagFilterExpression,
  TagFilterOperator,
  TimeConfig
} from '@instana/types';
import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';

import {
  CurrentState,
  FilterState,
  filterUrlStateDefinition,
  matrixPrefix,
  pathSegment,
  PresenterProps,
  syntheticTypesUrlParameter,
  locationsUrlParameter,
  applicationsUrlParameter
} from 'in-synthetics/utils/constants';
import showNotification, {
  calculateNextOccurrence,
  setReminder,
  storedAlarmTimeOrNull,
  timeExpired
} from 'in-synthetics/utils/setReminders';
// @ts-expect-error
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
//@ts-expect-error
import FloatingActionButtonMenu from 'in-components/FloatingActionButton/FloatingActionButtonMenu';
import { columnDefinitions } from 'in-synthetics/dashboards/global/tabs/tests/components/columnDefinitions';
// @ts-expect-error
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { applicationIdTagName, locationIdTagName, testNameTagName, typeTagName } from 'in-synthetics/tags';
import CreateSmartAlertDialog from 'in-alerting/smart-alerts/synthetics/CreateSmartAlertDialog';
import ViewSwitcher from 'in-synthetics/dashboards/global/tabs/tests/components/ViewSwitcher';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import TestConfigDialogPresenter from 'in-synthetics/components/TestConfigDialogPresenter';
import Filters from 'in-synthetics/dashboards/global/tabs/tests/components/Filters';
import { CONTAINS, EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import getTestSummaryList from 'in-synthetics/subscriptions/getTestSummaryList';
import { syntheticCreateSmartAlertsUIEnabled } from 'in-services/featureFlags';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import FloatingActionButton from 'in-components/FloatingActionButton';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { getChartGranularity } from 'in-stores/metric/metric';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { minutes } from 'in-services/time/time';
import useUrlState from 'in-hooks/useUrlState';
import { getTests } from 'in-synthetics/api';
import Sticky from 'in-components/Sticky';
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
  paginationResettingUrlParameters: [
    ...timeConfigUrlParameters,
    syntheticTypesUrlParameter,
    locationsUrlParameter,
    applicationsUrlParameter
  ],
  columnDefinitions: columnDefinitions,
  defaultOrderBy: 'successRate',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

const addFilter = (
  array: string[],
  name: string,
  operator: TagFilterOperator,
  tagFilterExpression: TagFilterExpression
) => {
  if (array.length !== 0 && Array.isArray(array)) {
    array.forEach(value => {
      tagFilterExpression.elements.push({
        value,
        name,
        operator,
        entity: NOT_APPLICABLE,
        type: 'TAG_FILTER'
      });
    });
  }
};

export default function TestSummaryList() {
  const timeConfig = useTimeConfig();
  const [{ syntheticTypes, locationIds, applicationIds }, setFilter] = useUrlState(urlStateDefinition);
  const storedDialogAlarm = storedAlarmTimeOrNull();
  const syntheticTests: Result<SyntheticTest[]> = useObservable<any, any[]>(() => getTests(), []) ?? pendingResult;

  useEffect(() => {
    if (storedDialogAlarm === null) {
      setReminder(calculateNextOccurrence(minutes.toMillis(0)));
      showNotification();
    } else {
      if (timeExpired()) {
        showNotification();
      }
    }
  }, [storedDialogAlarm]);

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
  function showSADialog() {
    return addActiveDialog(<CreateSmartAlertDialog />);
  }

  function useFilterHeader(isFilterAllowed: boolean) {
    return function Filter({ syntheticTypes, locationIds, applicationIds }: PresenterProps) {
      if (!isFilterAllowed) {
        return undefined;
      } else {
        return (
          <Filters
            result={syntheticTests}
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

      {syntheticCreateSmartAlertsUIEnabled ? (
        <FloatingActionButtons>
          <FloatingActionButtonMenu>
            <Button onClick={onAddWidget} icon="lib_openclose_add_box" kind="primaryv2">
              {t('in-synthetics:createTest.buttonLabel')}
            </Button>

            <Button onClick={showSADialog} icon="lib_alerts_create" kind="primaryv2">
              {t('in-synthetics:createSmartAlert.buttonLabel')}
            </Button>
          </FloatingActionButtonMenu>
        </FloatingActionButtons>
      ) : (
        <FloatingActionButtons>
          <FloatingActionButton onClick={onAddWidget} withBoxShadow icon="lib_line_chart">
            {t('in-synthetics:createTest.buttonLabel')}
          </FloatingActionButton>
        </FloatingActionButtons>
      )}
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
  const baseTagFilterExpression: TagFilterExpression = {
    elements: [],
    logicalOperator: 'AND',
    type: 'EXPRESSION'
  };
  /** tagFilterExpressions used here are to allow users to display a list of tests
   * with, for example, (type1 or type1) & at (location1, or location2, or location3) &
   * associated with (application1, or application2)
   */
  /** Each test is at most associated with one application */
  const appTagFilterExpression: TagFilterExpression = {
    elements: [],
    logicalOperator: 'OR',
    type: 'EXPRESSION'
  };
  /** Each test is associated with one type */
  const typeTagFilterExpression: TagFilterExpression = {
    elements: [],
    logicalOperator: 'OR',
    type: 'EXPRESSION'
  };
  /** Each test is associated with one or more locations */
  const locationTagFilterExpression: TagFilterExpression = {
    elements: [],
    logicalOperator: 'OR',
    type: 'EXPRESSION'
  };

  if (query && query.length > 0) {
    baseTagFilterExpression.elements.push({
      value: query,
      name: testNameTagName,
      operator: CONTAINS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    });
  }

  if (context == 'application') {
    appTagFilterExpression.elements.push({
      value: appId,
      name: applicationIdTagName,
      operator: EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    });
  }

  addFilter(syntheticTypes, typeTagName, EQUALS, typeTagFilterExpression);
  addFilter(locationIds, locationIdTagName, EQUALS, locationTagFilterExpression);
  addFilter(applicationIds, applicationIdTagName, EQUALS, appTagFilterExpression);

  baseTagFilterExpression.elements.push(typeTagFilterExpression, locationTagFilterExpression, appTagFilterExpression);

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
    tagFilterExpression: baseTagFilterExpression
  });
}
