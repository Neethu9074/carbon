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
  syntheticTypesUrlParameter,
  locationsUrlParameter,
  applicationsUrlParameter,
  entityIdsUrlParameter
} from 'in-synthetics/utils/constants';
import {
  applicationIdTagName,
  locationIdTagName,
  websiteIdTagName,
  mobileAppIdTagName,
  testIdTagName,
  testNameTagName,
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
import CreateSmartAlertDialog from 'in-alerting/smart-alerts/synthetics/CreateSmartAlertDialog';
import ViewSwitcher from 'in-synthetics/dashboards/global/tabs/tests/components/ViewSwitcher';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import { CONTAINS, EQUALS, NOT_EQUAL } from 'in-components/QueryBuilder/tagFilter/operators';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import getTestSummaryList from 'in-synthetics/subscriptions/getTestSummaryList';
import CreateSyntheticTest from 'in-synthetics/createTests/CreateSyntheticTest';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { useFilterHeader } from 'in-synthetics/dashboards/global/utils';
import { syntheticRbacLimitedEnabled } from 'in-services/featureFlags';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { ALERTING_CREATE } from 'in-services/tracking/eventNames';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { getChartGranularity } from 'in-stores/metric/metric';
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
    columnDefinitions: columnDefinitions,
    title: t('in-synthetics:dashboard.noDataAvailable.testSummaryTitle'),
    description: t('in-synthetics:dashboard.noDataAvailable.testSummaryDescription')
  }),
  paginationResettingUrlParameters: [
    ...timeConfigUrlParameters,
    syntheticTypesUrlParameter,
    locationsUrlParameter,
    syntheticRbacLimitedEnabled ? entityIdsUrlParameter : applicationsUrlParameter
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

const TestSummaryList = () => {
  const timeConfig = useTimeConfig();
  let allApplicationIds = new Set<string>();
  let allWebsiteIds = new Set<string>();
  let allMobileAppIds = new Set<string>();
  let associations;
  const [{ syntheticTypes, locationIds, applicationIds, entityIds }, setFilter] = useUrlState(urlStateDefinition);
  const storedDialogAlarm = storedAlarmTimeOrNull();
  const syntheticTests: Result<SyntheticTest[]> = useObservable<any, any[]>(() => getTests(), []) ?? pendingResult;
  const { trackCta } = useSegmentTracking();
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

  const showSADialog = () => {
    trackCta(ALERTING_CREATE);
    return addActiveDialog(<CreateSmartAlertDialog />);
  };

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

            {role?.canConfigureGlobalSyntheticSmartAlerts && (
              <Button onClick={showSADialog} icon="lib_alerts_create" kind="primaryv2">
                {t('in-synthetics:createSmartAlert.buttonLabel')}
              </Button>
            )}
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
  excludeIds = []
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
