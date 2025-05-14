/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useEffect, useState } from 'react';

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
import { Dropdown } from '@instana/carbon';

import {
  CurrentState,
  FilterState,
  filterUrlStateDefinition,
  matrixPrefix,
  pathSegment,
  syntheticTypesUrlParameter,
  locationsUrlParameter,
  applicationsUrlParameter,
  datascopeRunTypes,
  entityIdsUrlParameter
} from 'in-synthetics/utils/constants';
import {
  applicationIdTagName,
  locationIdTagName,
  websiteIdTagName,
  mobileAppIdTagName,
  testIdTagName,
  testNameTagName,
  runTypeTagName,
  typeTagName
} from 'in-synthetics/tags';
import showNotification, {
  calculateNextOccurrence,
  setReminder,
  storedAlarmTimeOrNull,
  timeExpired
} from 'in-synthetics/utils/setReminders';
// @ts-expect-error
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import columnDefinitions from 'in-synthetics/dashboards/global/tabs/tests/components/columnDefinitions';
import FloatingActionButtonMenu from 'in-components/FloatingActionButton/FloatingActionButtonMenu';
import { syntheticRbacLimitedEnabled, syntheticRunNowEnabled } from 'in-services/featureFlags';
import ViewSwitcher from 'in-synthetics/dashboards/global/tabs/tests/components/ViewSwitcher';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import { CONTAINS, EQUALS, NOT_EQUAL } from 'in-components/QueryBuilder/tagFilter/operators';
import CreateSmartAlert from 'in-alerting/smart-alerts/synthetics/CreateSmartAlert';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import getTestSummaryList from 'in-synthetics/subscriptions/getTestSummaryList';
import CreateSyntheticTest from 'in-synthetics/createTests/CreateSyntheticTest';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { useFilterHeader } from 'in-synthetics/dashboards/global/utils';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { getChartGranularity } from 'in-stores/metric/metric';
import { close } from 'in-components/DialogPresenter/store';
import useUrlState, { Options } from 'in-hooks/useUrlState';
import { pageNames } from 'in-services/tracking/pageNames';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { minutes } from 'in-services/time/time';
import { getTests } from 'in-synthetics/api';
import Sticky from 'in-components/Sticky';
import Footer from 'in-components/Footer';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from 'in-synthetics/dashboards/global/TestSummaryList.mless';

const urlStateDefinition: Options<FilterState> = {
  bind: filterUrlStateDefinition.bind,
  reducer: (prevState: FilterState, { syntheticTypes, locationIds, applicationIds, entityIds }: CurrentState) => {
    const commonUrlStateProps = {
      syntheticTypes: syntheticTypes || prevState.syntheticTypes,
      locationIds: locationIds || prevState.locationIds
    };
    return syntheticRbacLimitedEnabled
      ? { ...commonUrlStateProps, entityIds: entityIds || prevState.entityIds }
      : { ...commonUrlStateProps, applicationIds: applicationIds || prevState.applicationIds };
  }
};
const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    title: t('in-synthetics:dashboard.noDataAvailable.testSummaryTitle'),
    description: t('in-synthetics:dashboard.noDataAvailable.testSummaryDescription')
  }),
  paginationResettingUrlParameters: [
    ...timeConfigUrlParameters,
    syntheticTypesUrlParameter,
    locationsUrlParameter,
    syntheticRbacLimitedEnabled ? entityIdsUrlParameter : applicationsUrlParameter
  ],
  columnDefinitions,
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

const TestSummaryList = () => {
  const timeConfig = useTimeConfig();
  let allApplicationIds = new Set<string>();
  let allWebsiteIds = new Set<string>();
  let allMobileAppIds = new Set<string>();
  let associations;
  const [{ syntheticTypes, locationIds, applicationIds, entityIds }, setFilter] = useUrlState(urlStateDefinition);
  const storedDialogAlarm = storedAlarmTimeOrNull();
  const syntheticTests: Result<SyntheticTest[]> = useObservable<any, any[]>(() => getTests(), []) ?? pendingResult;
  const [runType, setRunType] = useState<string>(datascopeRunTypes[0].value);
  if (syntheticRbacLimitedEnabled && !syntheticTests?.progress?.loading) {
    syntheticTests?.data?.forEach(function (item: SyntheticTest) {
      if (item?.applications) {
        item.applications.forEach(id => allApplicationIds.add(id));
      }
      if (item?.websites) {
        item.websites.forEach(id => allWebsiteIds.add(id));
      }
      if (item?.mobileApps) {
        item.mobileApps.forEach(id => allMobileAppIds.add(id));
      }
    });
  }
  associations = {
    applications: Array.from(allApplicationIds),
    websites: Array.from(allWebsiteIds),
    mobileApps: Array.from(allMobileAppIds)
  };

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

  const rightHeader = useFilterHeader(true, syntheticTests, setFilter);
  const location = useLocation();

  return (
    <Sticky header={<ViewSwitcher />}>
      <LeftRightPadding>
        <ViewTrackingMeta
          data={{
            pagePath: location?.pathname,
            productArea: productAreas.synthetic_monitoring,
            pageRootName: pageNames.synthetic_monitoring_tests
          }}
        />
        <ServerTableWithUrlState
          get={getTestSummaryListData}
          timeConfig={timeConfig}
          rightHeader={rightHeader}
          cardTitle={t('in-synthetics:dashboard.testList.secondaryLabels.tests')}
          toolBarContent={
            syntheticRunNowEnabled && (
              <Dropdown
                className={locals.dropdownWidth}
                items={datascopeRunTypes}
                onChange={({ selectedItem }) => {
                  if (selectedItem != null) {
                    setRunType(selectedItem.value);
                  }
                }}
                label=""
                id={runType}
                titleText=""
                selectedItem={datascopeRunTypes.find(item => item.value === runType)}
                initialSelectedItem={datascopeRunTypes[0]}
              />
            )
          }
          runType={runType}
          syntheticTypes={syntheticTypes}
          locationIds={locationIds}
          applicationIds={applicationIds}
          entityIds={entityIds}
          associations={associations}
        />
      </LeftRightPadding>
      <Footer />

      {(role?.canConfigureSyntheticTests || role?.canConfigureGlobalSyntheticSmartAlerts) && (
        <FloatingActionButtons>
          <FloatingActionButtonMenu>
            {role?.canConfigureSyntheticTests && <CreateSyntheticTest onClose={close} />}

            {role?.canConfigureGlobalSyntheticSmartAlerts && <CreateSmartAlert isFloatingMenu />}
          </FloatingActionButtonMenu>
        </FloatingActionButtons>
      )}
    </Sticky>
  );
};

interface GetTestSummaryList {
  timeConfig: TimeConfig;
  orderBy: string;
  orderDirection: OrderDirection;
  page: number;
  pageSize: number;
  query: string;
  progress: Progress;
  context?: string;
  appId?: string;
  websiteId?: string;
  mobileAppId?: string;
  syntheticTypes?: string[];
  locationIds?: string[];
  applicationIds?: string[];
  entityIds?: string[];
  associations?: Record<string, string[]>;
  mobileAppIds?: string[];
  excludeIds?: string[];
  runType?: string;
}

export const getTestSummaryListData = ({
  timeConfig,
  orderBy = 'successRate',
  orderDirection = 'ASC',
  page = 1,
  pageSize = 20,
  query = '',
  context = '',
  appId = '',
  websiteId = '',
  mobileAppId = '',
  syntheticTypes = [],
  locationIds = [],
  applicationIds = [],
  entityIds = [],
  associations,
  excludeIds = [],
  runType = ''
}: GetTestSummaryList) => {
  const baseTagFilterExpression: TagFilterExpression = {
    elements: [],
    logicalOperator: 'AND',
    type: 'EXPRESSION'
  };
  const associationsTagFilterExpression: TagFilterExpression = {
    elements: [],
    logicalOperator: 'OR',
    type: 'EXPRESSION'
  };
  /** tagFilterExpressions used here are to allow users to display a list of tests
   * with, for example, (type1 or type1) & at (location1, or location2, or location3) &
   * associated with (association1 and/or association2)
   */

  /** Each test can be associated with 0 or more associations (applications, websites, mobile applications) */
  const appTagFilterExpression: TagFilterExpression = {
    elements: [],
    logicalOperator: 'OR',
    type: 'EXPRESSION'
  };

  const mobileAppsTagFilterExpression: TagFilterExpression = {
    elements: [],
    logicalOperator: 'OR',
    type: 'EXPRESSION'
  };

  const websiteTagFilterExpression: TagFilterExpression = {
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

  if (context == 'website') {
    websiteTagFilterExpression.elements.push({
      value: websiteId,
      name: websiteIdTagName,
      operator: EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    });
  }

  if (context == 'mobile') {
    mobileAppsTagFilterExpression.elements.push({
      value: mobileAppId,
      name: mobileAppIdTagName,
      operator: EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    });
  }
  if (syntheticRunNowEnabled) {
    const runTypeTagFilterExpression: TagFilterExpression = {
      elements: [],
      logicalOperator: 'OR',
      type: 'EXPRESSION'
    };
    runTypeTagFilterExpression.elements.push({
      value: runType,
      name: runTypeTagName,
      operator: EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    });
    baseTagFilterExpression.elements.push(runTypeTagFilterExpression);
  }
  addFilter(syntheticTypes, typeTagName, EQUALS, typeTagFilterExpression);
  addFilter(locationIds, locationIdTagName, EQUALS, locationTagFilterExpression);
  addFilter(applicationIds, applicationIdTagName, EQUALS, appTagFilterExpression);
  addFilter(excludeIds, testIdTagName, NOT_EQUAL, testFilterExpression);
  if (syntheticRbacLimitedEnabled && entityIds.length !== 0 && Array.isArray(entityIds)) {
    entityIds.forEach(value => {
      switch (value) {
        case 'applications':
          addFilter(associations?.applications!, applicationIdTagName, EQUALS, appTagFilterExpression);
          break;
        case 'websites':
          addFilter(associations?.websites!, websiteIdTagName, EQUALS, websiteTagFilterExpression);
          break;
        case 'mobileApps':
          addFilter(associations?.mobileApps!, mobileAppIdTagName, EQUALS, mobileAppsTagFilterExpression);
          break;
      }
    });
  } else {
    addFilter(applicationIds, applicationIdTagName, EQUALS, appTagFilterExpression);
  }

  associationsTagFilterExpression.elements.push(
    appTagFilterExpression,
    websiteTagFilterExpression,
    mobileAppsTagFilterExpression
  );

  baseTagFilterExpression.elements.push(
    typeTagFilterExpression,
    locationTagFilterExpression,
    syntheticRbacLimitedEnabled ? associationsTagFilterExpression : appTagFilterExpression,
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
};

export default TestSummaryList;
