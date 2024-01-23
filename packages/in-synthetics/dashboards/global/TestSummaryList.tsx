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
import {
  applicationIdTagName,
  locationIdTagName,
  testIdTagName,
  testNameTagName,
  typeTagName
} from 'in-synthetics/tags';
// @ts-expect-error
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
//@ts-expect-error
import FloatingActionButtonMenu from 'in-components/FloatingActionButton/FloatingActionButtonMenu';
// @ts-expect-error
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import columnDefinitions from 'in-synthetics/dashboards/global/tabs/tests/components/columnDefinitions';
import CreateSmartAlertDialog from 'in-alerting/smart-alerts/synthetics/CreateSmartAlertDialog';
import ViewSwitcher from 'in-synthetics/dashboards/global/tabs/tests/components/ViewSwitcher';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import { CONTAINS, EQUALS, NOT_EQUAL } from 'in-components/QueryBuilder/tagFilter/operators';
import Filters from 'in-synthetics/dashboards/global/tabs/tests/components/Filters';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import getTestSummaryList from 'in-synthetics/subscriptions/getTestSummaryList';
import CreateSyntheticTest from 'in-synthetics/createTests/CreateSyntheticTest';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { trackStartCreate } from 'in-alerting/smart-alerts/components/tracker';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { getChartGranularity } from 'in-stores/metric/metric';
import { pageNames } from 'in-services/tracking/pageNames';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { minutes } from 'in-services/time/time';
import useUrlState from 'in-hooks/useUrlState';
import { getTests } from 'in-synthetics/api';
import Sticky from 'in-components/Sticky';
import Footer from 'in-components/Footer';
import { role } from 'in-stores/user';
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

  //function reloadTests() {}

  function showSADialog() {
    trackStartCreate();
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
  const location = useLocation();

  return (
    <Sticky header={<ViewSwitcher />}>
      <LeftRightPadding>
        <ViewTrackingMeta
          data={{
            pageName: pageNames.synthetic_monitoring_tests,
            pagePath: location?.pathname,
            productArea: productAreas.synthetic_monitoring,
            pageRootName: pageNames.synthetic_monitoring
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

      {(role?.canConfigureSyntheticTests ||
        (role?.canConfigureGlobalSyntheticSmartAlerts ?? role?.canConfigureGlobalAlertConfigs)) && (
        <FloatingActionButtons>
          <FloatingActionButtonMenu>
            {role?.canConfigureSyntheticTests && <CreateSyntheticTest onClose={close} />}

            {(role?.canConfigureGlobalSyntheticSmartAlerts ?? role?.canConfigureGlobalAlertConfigs) && (
              <Button onClick={showSADialog} icon="lib_alerts_create" kind="primaryv2">
                {t('in-synthetics:createSmartAlert.buttonLabel')}
              </Button>
            )}
          </FloatingActionButtonMenu>
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
  excludeIds?: string[];
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
  applicationIds = [],
  excludeIds = []
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
  /** This filter expression excludes selected tests when creating Smart Alerts .  */
  const testFilterExpression: TagFilterExpression = {
    elements: [],
    logicalOperator: 'AND',
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
  addFilter(excludeIds, testIdTagName, NOT_EQUAL, testFilterExpression);

  baseTagFilterExpression.elements.push(
    typeTagFilterExpression,
    locationTagFilterExpression,
    appTagFilterExpression,
    testFilterExpression
  );

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
