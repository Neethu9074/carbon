/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { useObservable } from '@instana/hooks';

import {
  alertsList,
  applicationDashboard,
  configurationTab,
  dependencyMapTab,
  smartAlertsTab,
  summaryTab,
  syntheticsTab
} from 'in-applications/navigation/paths';
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import CreateGlobalSmartAlertButton from 'in-alerting/smart-alerts/applications/CreateGlobalSmartAlertButton';
import { ScopeRoles } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import CreateSmartAlertButton from 'in-alerting/smart-alerts/applications/components/CreateSmartAlertButton';
import InboundAllCallsDropdown from 'in-applications/Dashboards/commonComponents/InboundAllCallsDropdown';
import FloatingActionButtonMenu from 'in-components/FloatingActionButton/FloatingActionButtonMenu';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import { applicationDashboardUrlParameters } from 'in-applications/navigation/urlParameters';
import { clickSyntheticMonitoringTabInApplicationsTracker } from 'in-synthetics/tracker';
import { applicationSmartAlertFullScreenDesignEnabled } from 'in-services/featureFlags';
import CreateSmartAlert from 'in-alerting/smart-alerts/applications/CreateSmartAlert';
import { categoryGlobal } from 'in-alerting/smart-alerts/components/list/constants';
import getApplicationTabs from 'in-applications/Dashboards/application/tabs/index';
import AnalyzeCallsButton from 'in-applications/components/AnalyzeCallsButton';
import getEndpointTypes from 'in-applications/subscriptions/getEndpointTypes';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import { applicationTimeShiftSelectTracker } from 'in-applications/tracker';
import TimeShiftDropdown from 'in-components/TimeShift/TimeShiftDropdown';
import getApplication from 'in-applications/subscriptions/getApplication';
import ContextGuide from 'in-components/ContextGuide/ContextGuide';
import { alertsCategory } from 'in-applications/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { getApplicationConfigScopeRoleId } from 'in-api/users';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { getTimeShiftLabel } from 'in-stores/time/shifting';
import { pageNames } from 'in-services/tracking/pageNames';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/components/CreateSmartAlertButton.mless';

const urlStateDefinition = {
  bind: [applicationDashboardUrlParameters.applicationId, applicationDashboardUrlParameters.boundaryScope]
};

const boundaryScopeDropdownDisabledTabs = [dependencyMapTab, smartAlertsTab, syntheticsTab, configurationTab];

export default function ApplicationDashboard({ location }) {
  const [{ appId, boundaryScope }, setUrlState] = useUrlState(urlStateDefinition);
  const timeConfig = useTimeConfig();

  const endpointTypes = useObservable(
    getEndpointTypes({
      filter: {
        application: appId,
        timeConfig: timeConfig,
        applicationBoundaryScope: boundaryScope
      }
    }).map(result => result?.data),
    [appId, timeConfig, boundaryScope]
  );

  const canConfigureApplications = useObservable(
    role.canConfigureApplications
      ? getApplicationConfigScopeRoleId(appId)
          .map(result => result?.data?.toString())
          .map(data => data === ScopeRoles.Owner || data === ScopeRoles.Contributor)
      : false,
    [appId]
  );

  const props = {
    applicationId: appId,
    viewPath: applicationDashboard,
    timeConfig,
    boundaryScope: boundaryScope,
    onChange: setUrlState,
    location,
    currentTab: location.pathname.substr(location.pathname.lastIndexOf('/')),
    onBoundaryStateChange: setUrlState,
    endpointTypes
  };

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
        props={props}
        result$={getApplication({ id: props.applicationId })}
        withProps={({ result }) => ({
          applicationName: get(result, ['data', 'label'])
        })}
        tabChangeTracker={props =>
          props.tab === t('in-applications:labelSyntheticMonitoring')
            ? clickSyntheticMonitoringTabInApplicationsTracker({
                detail: 'Synthetic Monitoring tab in Applications section'
              })
            : null
        }
      />
    </>
  );
}

function Header(props) {
  return (
    <DashboardHeader
      {...props}
      icon="lib_application"
      title={t('in-applications:labelApplication')}
      label={get(props.result, ['data', 'label'])}
      renderButtonLine={renderButtonLine}
      renderButtonLineSecondary={renderButtonLineSecondary}
      showHistoricDataWarning={false}
    />
  );
}

function renderButtonLine(props) {
  const { applicationId, timeConfig, boundaryScope, location } = props;
  const isGlobalAlertConfig = getMatrixParameter(location, alertsList, alertsCategory) === categoryGlobal;
  const addSmartAlertButton = isGlobalAlertConfig ? (
    <CreateGlobalSmartAlertButton location={location} />
  ) : (
    <CreateSmartAlert
      applicationId={applicationId}
      location={location}
      boundaryScope={boundaryScope}
      defaultBoundaryScope={props.result.data.boundaryScope}
    />
  );

  const smartAlertCreateButton = isGlobalAlertConfig ? (
    <CreateSmartAlertButton
      isGlobal
      buttonName={t('in-alerting:smartAlerts.applications.components.createGlobalSmartAlertNew')}
      isFloatingButton
      isMenuItem
    />
  ) : (
    <CreateSmartAlertButton
      isGlobal={false}
      buttonName={t('in-alerting:smartAlerts.applications.components.createSmartAlertNew')}
      isFloatingButton
      isMenuItem
      boundaryScope={boundaryScope}
      defaultBoundaryScope={props.result.data.boundaryScope}
      applicationId={applicationId}
    />
  );

  const allowActionButtons = isGlobalAlertConfig
    ? role.canConfigureGlobalApplicationSmartAlerts
    : role.canConfigureApplicationSmartAlerts;

  const showAlertButton = allowActionButtons && !location.pathname.includes('/application/configuration');

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
        timeConfig={timeConfig}
        groupBy={createGroupBy('service.name', DESTINATION)}
      />

      {showAlertButton && applicationSmartAlertFullScreenDesignEnabled && (
        <FloatingActionButtons>
          <FloatingActionButtonMenu>
            {showAlertButton && <span className={locals.floatingBtnMenu}>{addSmartAlertButton}</span>}
            {showAlertButton && applicationSmartAlertFullScreenDesignEnabled && <>{smartAlertCreateButton}</>}
          </FloatingActionButtonMenu>
        </FloatingActionButtons>
      )}

      {showAlertButton && !applicationSmartAlertFullScreenDesignEnabled && (
        <FloatingActionButtons>{addSmartAlertButton}</FloatingActionButtons>
      )}
    </>
  );
}

const disableAllCallsDropdown = currentTab => {
  if (boundaryScopeDropdownDisabledTabs.includes(currentTab)) {
    return true;
  } else {
    return false;
  }
};

function renderButtonLineSecondary({ result, boundaryScope, currentTab, onBoundaryStateChange, timeConfig }) {
  return (
    <>
      <TimeShiftDropdown
        disabled={currentTab !== summaryTab}
        onChange={offset =>
          applicationTimeShiftSelectTracker({
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
        disabled={disableAllCallsDropdown(currentTab)}
      />
    </>
  );
}
