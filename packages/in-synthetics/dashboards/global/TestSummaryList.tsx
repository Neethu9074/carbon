/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

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
import { Message as CarbonMessage, Typography } from '@instana/components';
import { Button, Dropdown, HStack, Link, VStack } from '@instana/carbon';
import { useObservable } from '@instana/hooks';

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
  entityIdsUrlParameter,
  runTypeUrlParameter,
  executionTypeUrlParameter,
  runTypeScheduled,
  runTypeCICD
} from 'in-synthetics/utils/constants';
import {
  SYNTHETIC_TEST_BANNER_2FA_LINK_CLICK,
  SYNTHETIC_TEST_BANNER_ADDLOCATION_LINK_CLICK,
  SYNTHETIC_TEST_BANNER_IBM_DOC_CLICK,
  SYNTHETIC_TEST_BANNER_PRIMARY_CTC_CLICK,
  SYNTHETIC_TEST_BANNER_SHOW_LESS_CLICK,
  SYNTHETIC_TEST_BANNER_SHOW_MORE_CLICK
} from 'in-services/tracking/eventNames';
import {
  syntheticSslImprovementEnabled,
  syntheticRbacLimitedEnabled,
  syntheticRunNowEnabled,
  contextualOnboardingEnabled,
  syntheticInstanaHostedPoPEnabled
} from 'in-services/featureFlags';
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
import {
  addColumnCustomizationNotification,
  removeColumncustomizationNotification
} from 'in-synthetics/utils/setTestsColumnConfigurationMessage';
// @ts-expect-error
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { TestsTableWithUrlState } from 'in-synthetics/dashboards/global/tabs/tests/components/TestsTableWithUrlState';
// @ts-expect-error
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import getColumnDefinitions from 'in-synthetics/dashboards/global/tabs/tests/components/columnDefinitions';
import FloatingActionButtonMenu from 'in-components/FloatingActionButton/FloatingActionButtonMenu';
import ViewSwitcher from 'in-synthetics/dashboards/global/tabs/tests/components/ViewSwitcher';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import { CONTAINS, EQUALS, NOT_EQUAL } from 'in-components/QueryBuilder/tagFilter/operators';
import CreateNewLocationDialog from 'in-synthetics/createLocation/CreateNewLocationDialog';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import getTestSummaryList from 'in-synthetics/subscriptions/getTestSummaryList';
import CreateSyntheticTest from 'in-synthetics/createTests/CreateSyntheticTest';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { getLocationData } from 'in-synthetics/dashboards/global/LocationList';
import { IconForButton } from 'in-plg/components/IconForButton/IconForButton';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useFilterHeader } from 'in-synthetics/dashboards/global/utils';
import { syntheticLocationPath } from 'in-synthetics/navigation/paths';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { userSettingsTwoFactor } from 'in-settings/navigation/paths';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import { getChartGranularity } from 'in-stores/metric/metric';
import useUrlState, { Options } from 'in-hooks/useUrlState';
import { pageNames } from 'in-services/tracking/pageNames';
import { pendingResult } from 'in-services/fixedObjects';
import Banner from 'in-plg/components/Banner/Banner';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { getTests } from 'in-synthetics/api';
import Sticky from 'in-components/Sticky';
import Footer from 'in-components/Footer';
import { Trans, t } from 'in-i18n';

import locals from 'in-synthetics/dashboards/global/TestSummaryList.mless';

const urlStateDefinition: Options<FilterState> = {
  bind: filterUrlStateDefinition.bind,
  reducer: (
    prevState: FilterState,
    { syntheticTypes, locationIds, applicationIds, entityIds, runType, executionType }: CurrentState
  ) => {
    const urlStateProps: FilterState = {
      syntheticTypes: syntheticTypes ?? prevState.syntheticTypes,
      locationIds: locationIds ?? prevState.locationIds
    };

    if (syntheticRbacLimitedEnabled) {
      urlStateProps.entityIds = entityIds ?? prevState.entityIds;
    } else {
      urlStateProps.applicationIds = applicationIds ?? prevState.applicationIds;
    }
    if (syntheticRunNowEnabled) {
      urlStateProps.runType = runType ?? prevState.runType;
      urlStateProps.executionType = executionType ?? prevState.executionType;
    }
    return urlStateProps;
  }
};

function ServerTableWithUrlState(props: Parameters<typeof createServerTableWithUrlState>[0]) {
  const [role] = useCurrentUserRole();
  const columnDefinitions = getColumnDefinitions(role);
  const Component = createServerTableWithUrlState({
    Renderer: withEmptyTableState({
      columnDefinitions,
      title: t('in-synthetics:dashboard.noDataAvailable.testSummaryTitle'),
      description: t('in-synthetics:dashboard.noDataAvailable.testSummaryDescription')
    }),
    paginationResettingUrlParameters: [
      ...timeConfigUrlParameters,
      syntheticTypesUrlParameter,
      locationsUrlParameter,
      syntheticRbacLimitedEnabled ? entityIdsUrlParameter : applicationsUrlParameter,
      syntheticRunNowEnabled ? [runTypeUrlParameter, executionTypeUrlParameter] : []
    ],
    columnDefinitions,
    defaultOrderBy: 'successRate',
    defaultOrderDirection: 'ASC',
    defaultDisabledColumns: [
      'avg_response_time',
      'location',
      syntheticRbacLimitedEnabled ? 'associationLabels' : 'applicationLabel',
      'health'
    ],
    pathSegment,
    matrixPrefix
  });

  return <Component {...props} />;
}

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
  const [role] = useCurrentUserRole();
  const timeConfig = useTimeConfig();
  const location = useLocation();
  const { trackCta } = useSegmentTracking();
  let allApplicationIds = new Set<string>();
  let allWebsiteIds = new Set<string>();
  let allMobileAppIds = new Set<string>();
  let associations;
  const [{ syntheticTypes, locationIds, applicationIds, entityIds, runType, executionType }, setFilter] =
    useUrlState(urlStateDefinition);
  const showTestsColumnCustomizationMessage = addColumnCustomizationNotification();
  const syntheticTests: Result<SyntheticTest[]> = useObservable<any, any[]>(() => getTests(), []) ?? pendingResult;
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

  const rightHeader = useFilterHeader(true, syntheticTests, setFilter);

  const locationListObservable = getLocationData({
    timeConfig: timeConfig,
    orderBy: 'location_name',
    orderDirection: 'ASC',
    page: 1,
    pageSize: 1,
    query: '',
    locationTypes: []
  });

  const locationCount = useObservable(locationListObservable, []) ?? pendingResult;

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
        {showTestsColumnCustomizationMessage && (
          <div className={locals.flyout}>
            <CarbonMessage
              className={locals.toastMessage}
              title={t('in-synthetics:dashboard.testList.configureColumns.title')}
              inline={false}
              dismissible
              onClose={removeColumncustomizationNotification}
              description={t('in-synthetics:dashboard.testList.configureColumns.description')}
            />
          </div>
        )}
        <VStack gap={5}>
          {contextualOnboardingEnabled && (
            <Banner
              heading={t('in-synthetics:components.banner.heading')}
              expanded={locationCount?.data?.items?.length === 0}
              expandedContentLeft={<ExpandedContentLeft />}
              expandedContentRight={<ExpandedContentRight />}
              onCollapseFunc={() => {
                trackCta(SYNTHETIC_TEST_BANNER_SHOW_LESS_CLICK);
              }}
              onExpandFunc={() => {
                trackCta(SYNTHETIC_TEST_BANNER_SHOW_MORE_CLICK);
              }}
            />
          )}
          {syntheticSslImprovementEnabled ? (
            <TestsTableWithUrlState
              syntheticTypes={syntheticTypes}
              locationIds={locationIds}
              {...(syntheticRbacLimitedEnabled ? { entityIds, associations } : { applicationIds })}
              {...(runType ? { runType } : {})}
              {...(executionType ? { executionType } : {})}
              syntheticTests={syntheticTests}
              timeConfig={timeConfig}
              setFilter={setFilter}
            />
          ) : (
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
                      setFilter({ runType: selectedItem?.value! });
                    }}
                    label=""
                    id="runType"
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
          )}
        </VStack>
      </LeftRightPadding>
      <Footer />

      {!syntheticSslImprovementEnabled &&
        (role?.canConfigureSyntheticTests || role?.canConfigureGlobalSyntheticSmartAlerts) && (
          <FloatingActionButtons>
            <FloatingActionButtonMenu>
              {role?.canConfigureSyntheticTests && <CreateSyntheticTest onClose={close} />}
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
  executionType?: string[];
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
  runType = 'Scheduled',
  executionType
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
    if (executionType && executionType.length > 0) {
      executionType.forEach(type => {
        runTypeTagFilterExpression.elements.push({
          value: runTypeScheduled,
          name: runTypeTagName,
          operator: type === runTypeCICD ? NOT_EQUAL : EQUALS,
          entity: NOT_APPLICABLE,
          type: 'TAG_FILTER'
        });
      });
    } else if (executionType?.length === 0 || runType) {
      runTypeTagFilterExpression.elements.push({
        value: runTypeScheduled,
        name: runTypeTagName,
        operator: runType === runTypeCICD ? NOT_EQUAL : EQUALS,
        entity: NOT_APPLICABLE,
        type: 'TAG_FILTER'
      });
    }
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

const ExpandedContentLeft = () => {
  const { location, createHref } = useNavigation();
  const [role] = useCurrentUserRole();
  const { trackCta } = useSegmentTracking();
  return (
    <VStack gap={7}>
      <Typography variant="body-02">
        <Trans
          i18nKey="in-synthetics:components.banner.expandedLeftContent"
          components={{
            ibmDocumentation: (
              <Link
                href="https://ibm.biz/synthetic-monitoring"
                target="_blank"
                onClick={() => {
                  trackCta(SYNTHETIC_TEST_BANNER_IBM_DOC_CLICK);
                }}
              />
            )
          }}
        />
      </Typography>
      <Button
        renderIcon={() => <IconForButton icon="lib_openclose_add" iconSize="xs" />}
        onClick={() => {
          trackCta(SYNTHETIC_TEST_BANNER_PRIMARY_CTC_CLICK);
          if (role?.canConfigureSyntheticLocations && syntheticInstanaHostedPoPEnabled)
            addActiveDialog(<CreateNewLocationDialog onClose={close} />);
        }}
        href={createHref({ ...location, pathname: syntheticLocationPath })}
        disabled={!role?.canConfigureSyntheticTests}
      >
        {t('in-synthetics:components.banner.AddALocation')}
      </Button>
    </VStack>
  );
};

const ExpandedContentRight = () => {
  const { createHrefToPath } = useNavigation();
  const [role] = useCurrentUserRole();
  const { trackCta } = useSegmentTracking();
  if (role?.canConfigureSyntheticTests)
    return (
      <HStack>
        <div>
          <Typography variant="heading-01">{t('in-synthetics:components.banner.step1')}</Typography>
          <Trans
            i18nKey="in-synthetics:components.banner.step1Content"
            components={{
              twofAuthentication: (
                <Link
                  href={createHrefToPath(userSettingsTwoFactor)}
                  target="_blank"
                  onClick={() => {
                    trackCta(SYNTHETIC_TEST_BANNER_2FA_LINK_CLICK);
                  }}
                />
              )
            }}
          />
        </div>
        <div>
          <Typography variant="heading-01">{t('in-synthetics:components.banner.step2')}</Typography>
          <Trans
            i18nKey="in-synthetics:components.banner.step2Content"
            components={{
              addALocation: (
                <Link
                  href={createHrefToPath(syntheticLocationPath)}
                  target="_blank"
                  onClick={() => {
                    trackCta(SYNTHETIC_TEST_BANNER_ADDLOCATION_LINK_CLICK);
                  }}
                />
              )
            }}
          />
        </div>
        <div>
          <Typography variant="heading-01">{t('in-synthetics:components.banner.step3')}</Typography>
          <Trans
            i18nKey="in-synthetics:components.banner.step3Content"
            components={{
              bold: <strong />
            }}
          />
        </div>
      </HStack>
    );

  return (
    <div>
      <Typography variant="heading-01">{t('in-synthetics:components.banner.noPermissionHeading')}</Typography>
      <Typography variant="body-01">{t('in-synthetics:components.banner.noPermissionBody')}</Typography>
    </div>
  );
};
