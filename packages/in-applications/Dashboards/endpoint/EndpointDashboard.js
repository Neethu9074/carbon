import { get } from 'lodash';
import React from 'react';

import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import ApplicationContextIcon from 'in-applications/components/ApplicationSwitcherContext/ApplicationContextIcon';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import { applicationId, serviceId, endpointId, boundaryScope } from 'in-applications/navigation/matrix';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import UpstreamDownstreamButton from 'in-new-components/UpstreamDownstream/UpstreamDownstreamButton';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import FloatingActionButtons from 'in-new-components/FloatingActionButton/FloatingActionButtons';
import ApplicationSwitcherContext from 'in-applications/components/ApplicationSwitcherContext';
import ServiceContextIcon from 'in-applications/components/ServiceContext/ServiceContextIcon';
import CreateSmartAlert from 'in-applications/alerting/components/CreateSmartAlert';
import AnalyzeCallsButton from 'in-applications/components/AnalyzeCallsButton';
import { applicationSmartAlertsEnabled } from 'in-services/featureFlags';
import ServiceContext from 'in-applications/components/ServiceContext';
import { endpointDashboard } from 'in-applications/navigation/paths';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import getEndpoint from 'in-subscription/application/getEndpoint';
import tabs from 'in-applications/Dashboards/endpoint/tabs/index';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import DashboardHeader from 'in-new-components/DashboardHeader';
import { entityTypes } from 'in-analyze/applicationFilter';
import { timeConfig$ } from 'in-stores/time/config';
import Footer from 'in-new-components/Footer';
import connectTo from 'in-hoc/connectTo';
import { role } from 'in-stores/user';

export default connectTo({ timeConfig: timeConfig$ }, function EndpointDashboard({ location, timeConfig }) {
  const props = {
    applicationId: getMatrixParameter(location, endpointDashboard, applicationId),
    serviceId: getMatrixParameter(location, endpointDashboard, serviceId),
    endpointId: getMatrixParameter(location, endpointDashboard, endpointId),
    boundaryScope: getMatrixParameter(location, endpointDashboard, boundaryScope),
    viewPath: endpointDashboard,
    currentTab: location.pathname.substr(location.pathname.lastIndexOf('/')),
    timeConfig
  };

  const filterTabByResult = result =>
    get(result, ['data', 'syntheticType'], 'NON_SYNTHETIC') === 'SYNTHETIC'
      ? tab => tab.label === 'Summary'
      : () => true;

  return (
    <>
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

      {role.canConfigureCustomAlerts &&
        applicationSmartAlertsEnabled && (
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
});

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
      <UpstreamDownstreamButton
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        timeConfig={timeConfig}
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
