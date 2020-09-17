import { get } from 'lodash';
import React from 'react';

import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import InboundAllCallsDropdown from 'in-applications/Dashboards/commonComponents/InboundAllCallsDropdown';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import FloatingActionButtons from 'in-new-components/FloatingActionButton/FloatingActionButtons';
import { applicationDashboardUrlParameters } from 'in-applications/navigation/urlParameters';
import CreateSmartAlert from 'in-applications/alerting/components/CreateSmartAlert';
import { applicationDashboard, summaryTab } from 'in-applications/navigation/paths';
import AnalyzeCallsButton from 'in-applications/components/AnalyzeCallsButton';
import TimeShiftDropdown from 'in-new-components/TimeShift/TimeShiftDropdown';
import { applicationSmartAlertsEnabled } from 'in-services/featureFlags';
import getApplication from 'in-subscription/application/getApplication';
import ContextGuide from 'in-new-components/ContextGuide/ContextGuide';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import tabs from 'in-applications/Dashboards/application/tabs/index';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import DashboardHeader from 'in-new-components/DashboardHeader';
import { entityTypes } from 'in-analyze/applicationFilter';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';
import { role } from 'in-stores/user';

export default function ApplicationDashboard({ location }) {
  const [urlState, setUrlState] = useUrlState({
    bind: [applicationDashboardUrlParameters.applicationId, applicationDashboardUrlParameters.boundaryScope]
  });
  const timeConfig = useTimeConfig();

  const props = {
    applicationId: urlState.appId,
    viewPath: applicationDashboard,
    timeConfig,
    boundaryScope: urlState.boundaryScope,
    onChange: setUrlState,
    location,
    currentTab: location.pathname.substr(location.pathname.lastIndexOf('/')),
    onBoundaryStateChange: setUrlState
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
      title="Application"
      label={get(props.result, ['data', 'label'])}
      renderButtonLine={renderButtonLine}
      renderButtonLineSecondary={renderButtonLineSecondary}
    />
  );
}

function renderButtonLine(props) {
  const { applicationId, timeConfig, boundaryScope, label, location } = props;
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
        productArea="application"
      />
      <AnalyzeCallsButton
        applicationId={applicationId}
        boundaryScope={boundaryScope}
        timeConfig={timeConfig}
        groupByTag={{ name: 'service.name', entity: entityTypes.DESTINATION }}
        area="application"
      />

      {role.canConfigureCustomAlerts && applicationSmartAlertsEnabled && (
        <FloatingActionButtons>
          <CreateSmartAlert
            applicationLabel={label}
            applicationId={applicationId}
            location={location}
            boundaryScope={boundaryScope}
          />
        </FloatingActionButtons>
      )}
    </>
  );
}

function renderButtonLineSecondary({ result, boundaryScope, currentTab, onBoundaryStateChange }) {
  return (
    <>
      <TimeShiftDropdown disabled={currentTab !== summaryTab} />
      <InboundAllCallsDropdown
        data={result.data}
        boundaryScope={boundaryScope}
        onBoundaryStateChange={onBoundaryStateChange}
        defaultBoundaryScope={result.data?.boundaryScope}
        disabled={location.pathname === '/application/map'}
      />
    </>
  );
}
