/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { get } from 'lodash';
import { t } from 'in-i18n';
import React from 'react';

import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import IncludeSyntheticCallsDropdown from 'in-applications/Dashboards/commonComponents/IncludeSyntheticCallsDropdown';
import { applicationDashboard, summaryTab, errorMessagesTab, logMessagesTab } from 'in-applications/navigation/paths';
import InboundAllCallsDropdown from 'in-applications/Dashboards/commonComponents/InboundAllCallsDropdown';
import { isSyntheticOption } from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import FloatingActionButtons from 'in-new-components/FloatingActionButton/FloatingActionButtons';
import { applicationDashboardUrlParameters } from 'in-applications/navigation/urlParameters';
import CreateSmartAlert from 'in-applications/alerting/components/CreateSmartAlert';
import AnalyzeCallsButton from 'in-applications/components/AnalyzeCallsButton';
import TimeShiftDropdown from 'in-new-components/TimeShift/TimeShiftDropdown';
import getEndpointTypes from 'in-applications/subscriptions/getEndpointTypes';
import { applicationTimeShiftSelectTracker } from 'in-applications/tracker';
import { applicationSmartAlertsEnabled } from 'in-services/featureFlags';
import getApplication from 'in-subscription/application/getApplication';
import ContextGuide from 'in-new-components/ContextGuide/ContextGuide';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import tabs from 'in-applications/Dashboards/application/tabs/index';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { syntheticCallsEnabled } from 'in-services/featureFlags';
import DashboardHeader from 'in-new-components/DashboardHeader';
import { getTimeShiftLabel } from 'in-stores/time/shifting';
import { entityTypes } from 'in-analyze/applicationFilter';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
import useUrlState from 'in-hooks/useUrlState';
import { role } from 'in-stores/user';

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
  const { applicationId, timeConfig, boundaryScope, label, location, syntheticCalls } = props;

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
        groupByTag={{ name: 'service.name', entity: entityTypes.DESTINATION }}
        syntheticCalls={syntheticCalls}
        area="application"
      />

      {role.canConfigureCustomAlerts && applicationSmartAlertsEnabled && (
        <FloatingActionButtons>
          <CreateSmartAlert
            applicationLabel={label}
            applicationId={applicationId}
            location={location}
            boundaryScope={boundaryScope}
            defaultBoundaryScope={props.result.data.boundaryScope}
            includeSynthetic={isSyntheticOption(props.syntheticCalls)}
          />
        </FloatingActionButtons>
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
        disabled={location.pathname === '/application/map'}
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
