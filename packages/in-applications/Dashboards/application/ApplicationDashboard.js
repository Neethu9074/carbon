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
  dependencyMapTab,
  errorMessagesTab,
  logMessagesTab,
  summaryTab
} from 'in-applications/navigation/paths';
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import CreateGlobalSmartAlertButton from 'in-alerting/smart-alerts/applications/components/CreateGlobalSmartAlertButton';
import IncludeSyntheticCallsDropdown from 'in-applications/Dashboards/commonComponents/IncludeSyntheticCallsDropdown';
import InboundAllCallsDropdown from 'in-applications/Dashboards/commonComponents/InboundAllCallsDropdown';
import { isSyntheticOption } from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import CreateSmartAlert from 'in-alerting/smart-alerts/applications/components/CreateSmartAlert';
import { applicationSmartAlertsEnabled, syntheticCallsEnabled } from 'in-services/featureFlags';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import { applicationDashboardUrlParameters } from 'in-applications/navigation/urlParameters';
import { categoryGlobal } from 'in-alerting/smart-alerts/applications/inventory/constants';
import AnalyzeCallsButton from 'in-applications/components/AnalyzeCallsButton';
import getEndpointTypes from 'in-applications/subscriptions/getEndpointTypes';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import { applicationTimeShiftSelectTracker } from 'in-applications/tracker';
import TimeShiftDropdown from 'in-components/TimeShift/TimeShiftDropdown';
import getApplication from 'in-subscription/application/getApplication';
import tabs from 'in-applications/Dashboards/application/tabs/index';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import ContextGuide from 'in-components/ContextGuide/ContextGuide';
import { alertsCategory } from 'in-applications/navigation/matrix';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import DashboardHeader from 'in-components/DashboardHeader';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { getTimeShiftLabel } from 'in-stores/time/shifting';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

const urlStateDefinition = {
  bind: [
    applicationDashboardUrlParameters.applicationId,
    applicationDashboardUrlParameters.boundaryScope,
    applicationDashboardUrlParameters.syntheticCalls
  ]
};

export default function ApplicationDashboard({ location }) {
  const [{ appId, boundaryScope, syntheticCalls }, setUrlState] = useUrlState(urlStateDefinition);
  const timeConfig = useTimeConfig();

  const endpointTypes = useObservable(
    getEndpointTypes({
      filter: {
        application: appId,
        timeConfig: timeConfig,
        applicationBoundaryScope: boundaryScope,
        includeSyntheticCalls: isSyntheticOption(syntheticCalls)
      }
    }).map(result => result?.data),
    [appId, timeConfig, boundaryScope, syntheticCalls]
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
    syntheticCalls: syntheticCalls,
    onSyntheticCallsStateChange: setUrlState,
    endpointTypes
  };

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: 'Applications',
          pageRootName: 'Application'
        }}
      />

      <TabView
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
        result$={getApplication({ id: props.applicationId })}
        withProps={({ result }) => ({
          applicationName: get(result, ['data', 'label'])
        })}
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
    />
  );
}

function renderButtonLine(props) {
  const { applicationId, timeConfig, boundaryScope, location, syntheticCalls } = props;
  const isGlobalAlertConfig = getMatrixParameter(location, alertsList, alertsCategory) === categoryGlobal;

  const AddSmartAlertButton = isGlobalAlertConfig ? (
    <CreateGlobalSmartAlertButton location={location} />
  ) : (
    <CreateSmartAlert
      applicationId={applicationId}
      location={location}
      boundaryScope={boundaryScope}
      defaultBoundaryScope={props.result.data.boundaryScope}
      includeSynthetic={isSyntheticOption(props.syntheticCalls)}
    />
  );

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
        syntheticCalls={syntheticCalls}
        productArea="application"
      />
      <AnalyzeCallsButton
        applicationId={applicationId}
        boundaryScope={boundaryScope}
        timeConfig={timeConfig}
        groupBy={createGroupBy('service.name', DESTINATION)}
        syntheticCalls={syntheticCalls}
      />

      {role.canConfigureCustomAlerts && applicationSmartAlertsEnabled && (
        <FloatingActionButtons>{AddSmartAlertButton}</FloatingActionButtons>
      )}
    </>
  );
}

function renderButtonLineSecondary({
  result,
  boundaryScope,
  syntheticCalls,
  currentTab,
  onBoundaryStateChange,
  onSyntheticCallsStateChange,
  timeConfig
}) {
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
        disabled={currentTab === dependencyMapTab}
      />
      {syntheticCallsEnabled && (
        <IncludeSyntheticCallsDropdown
          data={result.data}
          syntheticCalls={syntheticCalls}
          onSyntheticCallsStateChange={onSyntheticCallsStateChange}
          disabled={currentTab === errorMessagesTab || currentTab === logMessagesTab}
        />
      )}
    </>
  );
}
