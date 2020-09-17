import { get } from 'lodash';
import React from 'react';

import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import ApplicationContextIcon from 'in-applications/components/ApplicationSwitcherContext/ApplicationContextIcon';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import InboundAllCallsDropdown from 'in-applications/Dashboards/commonComponents/InboundAllCallsDropdown';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import FloatingActionButtons from 'in-new-components/FloatingActionButton/FloatingActionButtons';
import ApplicationSwitcherContext from 'in-applications/components/ApplicationSwitcherContext';
import ServiceContextIcon from 'in-applications/components/ServiceContext/ServiceContextIcon';
import { endpointDashboardUrlParameters } from 'in-applications/navigation/urlParameters';
import CreateSmartAlert from 'in-applications/alerting/components/CreateSmartAlert';
import { endpointDashboard, summaryTab } from 'in-applications/navigation/paths';
import AnalyzeCallsButton from 'in-applications/components/AnalyzeCallsButton';
import TimeShiftDropdown from 'in-new-components/TimeShift/TimeShiftDropdown';
import { applicationSmartAlertsEnabled } from 'in-services/featureFlags';
import ServiceContext from 'in-applications/components/ServiceContext';
import ContextGuide from 'in-new-components/ContextGuide/ContextGuide';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import getEndpoint from 'in-subscription/application/getEndpoint';
import tabs from 'in-applications/Dashboards/endpoint/tabs/index';
import DashboardHeader from 'in-new-components/DashboardHeader';
import { entityTypes } from 'in-analyze/applicationFilter';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';
import Footer from 'in-new-components/Footer';
import { role } from 'in-stores/user';

export default function EndpointDashboard({ location }) {
  const [urlState, setUrlState] = useUrlState({
    bind: [
      endpointDashboardUrlParameters.applicationId,
      endpointDashboardUrlParameters.serviceId,
      endpointDashboardUrlParameters.endpointId,
      endpointDashboardUrlParameters.boundaryScope
    ]
  });
  const timeConfig = useTimeConfig();

  const props = {
    applicationId: urlState.appId,
    serviceId: urlState.serviceId,
    endpointId: urlState.endpointId,
    boundaryScope: urlState.boundaryScope,
    viewPath: endpointDashboard,
    currentTab: location.pathname.substr(location.pathname.lastIndexOf('/')),
    onChange: setUrlState,
    timeConfig,
    onBoundaryStateChange: setUrlState,
    location
  };

  const filterTabByResult = result =>
    get(result, ['data', 'syntheticType'], 'NON_SYNTHETIC') === 'SYNTHETIC'
      ? tab => tab.label === 'Summary'
      : () => true;

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: 'Applications',
          pageRootName: 'Endpoint',
          inContextOfApplication: props.applicationId != null
        }}
      />

      <TabView
        result$={getEndpoint({
          id: props.endpointId,
          filter: {
            application: props.applicationId,
            service: null,
            endpoint: props.endpointId,
            timeConfig
          }
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        filterTabByResult={filterTabByResult}
        props={props}
      />

      {role.canConfigureCustomAlerts && applicationSmartAlertsEnabled && (
        <FloatingActionButtons>
          <CreateSmartAlert
            serviceId={props.serviceId}
            endpointId={props.endpointId}
            applicationId={props.applicationId}
            location={location}
            boundaryScope={props.boundaryScope}
          />
        </FloatingActionButtons>
      )}

      <Footer />
    </>
  );
}

function Header(props) {
  const contextConfigurations = [];
  if (props.applicationId) {
    contextConfigurations.push({
      renderContext: renderApplicationContext,
      renderContextIcon: ApplicationContextIcon
    });
  }
  if (props.serviceId) {
    contextConfigurations.push({
      renderContext: renderServiceContext,
      renderContextIcon: ServiceContextIcon
    });
  }

  return (
    <DashboardHeader
      {...props}
      icon="lib_application_endpoint"
      title="Endpoint"
      label={get(props.result, ['data', 'label'])}
      renderButtonLine={renderButtonLine}
      renderButtonLineSecondary={renderButtonLineSecondary}
      renderMetaInformation={renderMetaInformation}
      contextConfigurations={contextConfigurations}
    />
  );
}

function renderButtonLine({ applicationId, serviceId, endpointId, boundaryScope, timeConfig, result }) {
  return (
    <>
      <ApplicationEntityHealthIndicatorBehavior
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        resolvedEndpointId={get(result, ['data', 'id'])}
        timeConfig={timeConfig}
      />
      <ContextGuide
        id={endpointId}
        timeConfig={timeConfig}
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        productArea="endpoint"
      />
      <AnalyzeCallsButton
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        boundaryScope={boundaryScope}
        syntheticType={get(result, ['data', 'syntheticType'])}
        timeConfig={timeConfig}
        groupByTag={{ name: 'call.name', entity: entityTypes.NOT_APPLICABLE }}
        area="endpoint"
      />
    </>
  );
}

function renderButtonLineSecondary({ currentTab, applicationId, boundaryScope, onBoundaryStateChange }) {
  return (
    <>
      <TimeShiftDropdown disabled={currentTab !== summaryTab} />
      {applicationId && (
        <InboundAllCallsDropdown
          boundaryScope={boundaryScope}
          onBoundaryStateChange={onBoundaryStateChange}
          disabled={location.pathname === '/endpoint/flowMap'}
        />
      )}
    </>
  );
}

function renderMetaInformation({ result }) {
  return (
    <>
      <EndpointTypeBadgeList types={[result.data.type]} />
      <TechnologyIndicatorList technologies={result.data.technologies} responsive={false} />
    </>
  );
}

function renderApplicationContext(props) {
  return <ApplicationSwitcherContext {...props} />;
}

function renderServiceContext(props) {
  return <ServiceContext {...props} />;
}
