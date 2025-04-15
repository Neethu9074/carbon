/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { get } from 'lodash';
import React from 'react';

import { Application, ApplicationBoundaryScope, Result, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import {
  alertsList,
  applicationDashboard,
  configurationTab,
  dependencyMapTab,
  smartAlertsTab,
  summaryTab,
  syntheticsTab,
  alertsTabListFullyQualified
} from 'in-applications/navigation/paths';
// @ts-expect-error needs TS migration
import CreateGlobalSmartAlertButton from 'in-alerting/smart-alerts/applications/CreateGlobalSmartAlertButton';
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import { ScopeRoles } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import InboundAllCallsDropdown from 'in-applications/Dashboards/commonComponents/InboundAllCallsDropdown';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import { applicationDashboardUrlParameters } from 'in-applications/navigation/urlParameters';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import InvalidUrlAlert from 'in-applications/Dashboards/commonComponents/InvalidUrlAlert';
import CreateSmartAlert from 'in-alerting/smart-alerts/applications/CreateSmartAlert';
import DashboardHeader, { DashboardHeaderProps } from 'in-components/DashboardHeader';
import { categoryGlobal } from 'in-alerting/smart-alerts/components/list/constants';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import getApplicationTabs from 'in-applications/Dashboards/application/tabs/index';
import AnalyzeCallsButton from 'in-applications/components/AnalyzeCallsButton';
import getEndpointTypes from 'in-applications/subscriptions/getEndpointTypes';
import { useVulnerabilityTracker } from 'in-events/useVulnerabilityTracker';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import TimeShiftDropdown from 'in-components/TimeShift/TimeShiftDropdown';
import getApplication from 'in-applications/subscriptions/getApplication';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { smartAlertCarbonTableEnabled } from 'in-services/featureFlags';
import { applicationsList } from 'in-applications/navigation/paths';
import ContextGuide from 'in-components/ContextGuide/ContextGuide';
import { alertsCategory } from 'in-applications/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { getApplicationConfigScopeRoleId } from 'in-api/users';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { getTimeShiftLabel } from 'in-stores/time/shifting';
import { pageNames } from 'in-services/tracking/pageNames';
import { Location } from 'in-stores/navigation/types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

const urlStateDefinition = {
  bind: [applicationDashboardUrlParameters.applicationId, applicationDashboardUrlParameters.boundaryScope]
};

const boundaryScopeDropdownDisabledTabs = [dependencyMapTab, smartAlertsTab, syntheticsTab, configurationTab];

export default function ApplicationDashboard({ location }: { location: Location }) {
  const { trackSyntheticMonitoringTabInApplicationsClicked } = useApplicationTracker();
  const { trackVulnerabilitiesTabInApplications } = useVulnerabilityTracker();
  const [{ appId, boundaryScope }, setUrlState] = useUrlState(urlStateDefinition);
  const timeConfig = useTimeConfig();

  const endpointTypes = useObservable(
    getEndpointTypes({
      filter: {
        application: appId,
        timeConfig: timeConfig,
        applicationBoundaryScope: boundaryScope,
        // TODO: check if these can be passed from somewhere
        includeInternalCalls: false,
        includeSyntheticCalls: false,
        useLongTermDataOnly: false
      }
    }).map(result => result?.data),
    [appId, timeConfig, boundaryScope]
  );
  const { createHref } = useNavigation();

  const canConfigureApplications = useObservable(
    role?.canConfigureApplications
      ? getApplicationConfigScopeRoleId(appId)
          .map(result => result?.data?.toString())
          .map(data => data === ScopeRoles.Owner || data === ScopeRoles.Contributor)
      : just(false),
    [appId]
  );

  const tabViewProps = {
    applicationId: appId,
    viewPath: applicationDashboard,
    timeConfig,
    boundaryScope: boundaryScope,
    onChange: setUrlState,
    location,
    currentTab: location.pathname.substring(location.pathname.lastIndexOf('/')),
    onBoundaryStateChange: setUrlState,
    endpointTypes
  };

  if (!appId) {
    return (
      <InvalidUrlAlert
        href={createHref({ ...location, pathname: applicationsList })}
        description={t('in-applications:dashboards.idNotPresent', {
          id: 'Application ID'
        })}
        linkText={t('in-applications:linkViewAllApplications')}
      />
    );
  }
  return (
    <>
      <ViewTrackingMeta
        data={{
          pagePath: location?.pathname,
          productArea: productAreas.applications,
          pageRootName: pageNames.application_summary
        }}
      />
      <TabView
        HeaderComponent={Header}
        location={location}
        tabs={getApplicationTabs(canConfigureApplications)}
        props={tabViewProps}
        result$={getApplication({ id: tabViewProps.applicationId })}
        withProps={({ result }) => ({
          applicationName: get(result, ['data', 'label'])
        })}
        tabChangeTracker={({ tab }) => {
          if (tab === t('in-applications:labelSyntheticMonitoring')) {
            trackSyntheticMonitoringTabInApplicationsClicked();
          } else if (tab === t('in-events:labelCveIssue')) {
            trackVulnerabilitiesTabInApplications();
          }
        }}
      />
    </>
  );
}

function Header(
  props: Omit<DashboardHeaderProps, 'icon' | 'title' | 'label' | 'renderButtonLine' | 'renderButtonLineSecondary'>
) {
  return (
    <DashboardHeader
      {...props}
      icon="lib_application"
      title={t('in-applications:labelApplication')}
      label={get(props.result, ['data', 'label'])}
      renderButtonLine={renderButtonLine}
      renderButtonLineSecondary={RenderButtonLineSecondary}
    />
  );
}

interface ButtonLineProps {
  applicationId: string;
  timeConfig: TimeConfig;
  boundaryScope: ApplicationBoundaryScope;
  location: Location;
  result: Result<Application>;
}

function renderButtonLine(props: ButtonLineProps) {
  const { applicationId, timeConfig, boundaryScope, location, result } = props;
  const isGlobalAlertConfig = getMatrixParameter(location, alertsList, alertsCategory) === categoryGlobal;
  const addSmartAlertButton = isGlobalAlertConfig ? (
    <FloatingActionButtons>
      <CreateGlobalSmartAlertButton location={location} renderAsSimpleButton />
    </FloatingActionButtons>
  ) : (
    <CreateSmartAlert
      applicationId={applicationId}
      location={location}
      boundaryScope={boundaryScope}
      defaultBoundaryScope={result.data?.boundaryScope}
    />
  );

  const allowActionButtons = isGlobalAlertConfig
    ? role?.canConfigureGlobalApplicationSmartAlerts
    : role?.canConfigureApplicationSmartAlerts;

  const hideButtonInAlertsTab = smartAlertCarbonTableEnabled
    ? location?.pathname === alertsTabListFullyQualified || location?.pathname === alertsList
    : false;

  const showAlertButton =
    allowActionButtons && !hideButtonInAlertsTab && !location.pathname.includes('/application/configuration');

  return (
    <>
      <ApplicationEntityHealthIndicatorBehavior
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        applicationId={applicationId}
        timeConfig={timeConfig}
      />
      <ContextGuide
        id={applicationId}
        timeConfig={timeConfig}
        applicationId={applicationId}
        boundaryScope={boundaryScope}
        productArea="application"
      />
      <AnalyzeCallsButton
        applicationId={applicationId}
        boundaryScope={boundaryScope}
        groupBy={createGroupBy('service.name', DESTINATION)}
      />

      {/* Add Smart alert button to UI  */}
      {showAlertButton && addSmartAlertButton}
    </>
  );
}

interface ButtonLineSecondaryProps {
  result: Result<Application>;
  boundaryScope: string | undefined;
  currentTab: string;
  onBoundaryStateChange: (state: Record<string, any>) => void;
  timeConfig: TimeConfig;
}

function RenderButtonLineSecondary({
  result,
  boundaryScope,
  currentTab,
  onBoundaryStateChange,
  timeConfig
}: ButtonLineSecondaryProps) {
  const { trackApplicationTimeShiftSelected } = useApplicationTracker();
  return (
    <>
      <TimeShiftDropdown
        disabled={currentTab !== summaryTab}
        onChange={(offset: number) =>
          trackApplicationTimeShiftSelected({
            area: 'application',
            offset: getTimeShiftLabel({ offset: offset }),
            windowSize: timeConfig.windowSize,
            autoRefresh: timeConfig.autoRefresh
          })
        }
      />
      <InboundAllCallsDropdown
        data={result.data}
        boundaryScope={boundaryScope}
        onBoundaryStateChange={onBoundaryStateChange}
        disabled={boundaryScopeDropdownDisabledTabs.includes(currentTab)}
      />
    </>
  );
}
