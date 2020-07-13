import { compose } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import InboundAllCallsDropdown from 'in-applications/Dashboards/commonComponents/InboundAllCallsDropdown';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import FloatingActionButtons from 'in-new-components/FloatingActionButton/FloatingActionButtons';
import { applicationDashboardUrlParameters } from 'in-applications/navigation/urlParameters';
import CreateSmartAlert from 'in-applications/alerting/components/CreateSmartAlert';
import AnalyzeCallsButton from 'in-applications/components/AnalyzeCallsButton';
import { applicationSmartAlertsEnabled } from 'in-services/featureFlags';
import getApplication from 'in-subscription/application/getApplication';
import { applicationDashboard } from 'in-applications/navigation/paths';
import ContextGuide from 'in-new-components/ContextGuide/ContextGuide';
import tabs from 'in-applications/Dashboards/application/tabs/index';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import DashboardHeader from 'in-new-components/DashboardHeader';
import { entityTypes } from 'in-analyze/applicationFilter';
import { timeConfig$ } from 'in-stores/time/config';
import withUrlState from 'in-hoc/withUrlState';
import connectTo from 'in-hoc/connectTo';
import { role } from 'in-stores/user';

export default compose(
  withUrlState({
    bind: [
      applicationDashboardUrlParameters.applicationId,
      applicationDashboardUrlParameters.serviceId,
      applicationDashboardUrlParameters.endpointId,
      applicationDashboardUrlParameters.boundaryScope
    ],
    reducerName: 'onBoundaryStateChange'
  }),
  connectTo({
    timeConfig: timeConfig$
  })
)(ApplicationDashboard);
function ApplicationDashboard({
  onBoundaryStateChange,
  appId,
  boundaryScope,
  serviceId,
  endpointId,
  location,
  timeConfig
}) {
  const props = {
    applicationId: appId,
    serviceId,
    endpointId,
    viewPath: applicationDashboard,
    onBoundaryStateChange,
    timeConfig,
    boundaryScope,
    location
  };

  return (
    <>
      <TabView
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
        result$={getApplication({ id: appId })}
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
  const { applicationId, serviceId, endpointId, timeConfig, boundaryScope, label, location } = props;
  return (
    <>
      <ApplicationEntityHealthIndicatorBehavior
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        timeConfig={timeConfig}
      />
      <ContextGuide
        id={applicationId}
        timeConfig={timeConfig}
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        productArea="application"
      />
      <AnalyzeCallsButton
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        boundaryScope={boundaryScope}
        timeConfig={timeConfig}
        groupByTag={{ name: 'service.name', entity: entityTypes.DESTINATION }}
        area="application"
      />

      {role.canConfigureCustomAlerts &&
        applicationSmartAlertsEnabled && (
          <FloatingActionButtons>
            <CreateSmartAlert
              applicationLabel={label}
              serviceId={serviceId}
              endpointId={endpointId}
              applicationId={applicationId}
              location={location}
              boundaryScope={boundaryScope}
            />
          </FloatingActionButtons>
        )}
    </>
  );
}

function renderButtonLineSecondary({ onBoundaryStateChange, result, boundaryScope }) {
  return (
    <InboundAllCallsDropdown
      data={result.data}
      boundaryScope={boundaryScope}
      onBoundaryStateChange={onBoundaryStateChange}
      area="application"
    />
  );
}
