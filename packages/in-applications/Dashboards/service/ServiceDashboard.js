import { get } from 'lodash';
import React from 'react';

import InstanaServiceToCloudfoundryApplicationButton from 'in-cloudfoundry/commonComponents/InstanaServiceToCloudfoundryApplicationButton';
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import InstanaServiceToKubernetesServicesButton from 'in-kubernetes/components/InstanaServiceToKubernetesServicesButton';
import ApplicationContextIcon from 'in-applications/components/ApplicationSwitcherContext/ApplicationContextIcon';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import { applicationId, serviceId, endpointId, boundaryScope } from 'in-applications/navigation/matrix';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import UpstreamDownstreamButton from 'in-new-components/UpstreamDownstream/UpstreamDownstreamButton';
import ApplicationSwitcherContext from 'in-applications/components/ApplicationSwitcherContext';
import AnalyzeCallsButton from 'in-applications/components/AnalyzeCallsButton';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { serviceDashboard } from 'in-applications/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-applications/Dashboards/service/tabs/index';
import getService from 'in-subscription/application/getService';
import DashboardHeader from 'in-new-components/DashboardHeader';
import StackButton from 'in-new-components/Stack/StackButton';
import { hasKubernetesAccess } from 'in-stores/permission';
import { entityTypes } from 'in-analyze/applicationFilter';
import { timeConfig$ } from 'in-stores/time/config';
import Footer from 'in-new-components/Footer';
import connectTo from 'in-hoc/connectTo';

export default connectTo({ timeConfig: timeConfig$ }, function ServiceDashboard({ location, timeConfig }) {
  const props = {
    applicationId: getMatrixParameter(location, serviceDashboard, applicationId),
    serviceId: getMatrixParameter(location, serviceDashboard, serviceId),
    endpointId: getMatrixParameter(location, serviceDashboard, endpointId),
    boundaryScope: getMatrixParameter(location, serviceDashboard, boundaryScope),
    viewPath: serviceDashboard,
    currentTab: location.pathname.substr(location.pathname.lastIndexOf('/')),
    timeConfig
  };

  return (
    <>
      <TabView
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        result$={getService({
          id: props.serviceId,
          filter: {
            application: props.applicationId,
            service: props.serviceId,
            endpoint: props.endpointId,
            timeConfig
          }
        })}
        props={props}
      />

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

  return (
    <DashboardHeader
      {...props}
      icon="lib_application_service"
      label={get(props.result, ['data', 'label'])}
      renderButtonLine={renderButtonLine}
      renderButtonLineSecondary={renderButtonLineSecondary}
      renderMetaInformation={renderMetaInformation}
      contextConfigurations={contextConfigurations}
    />
  );
}

function renderButtonLine({ applicationId, serviceId, endpointId, boundaryScope, timeConfig }) {
  return (
    <>
      <ApplicationEntityHealthIndicatorBehavior
        showOkayOnNoIssues={false}
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        timeConfig={timeConfig}
      />
      <StackButton id={serviceId} timeConfig={timeConfig} productArea="service" />
      <UpstreamDownstreamButton applicationId={applicationId} serviceId={serviceId} timeConfig={timeConfig} />
      <AnalyzeCallsButton
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        boundaryScope={boundaryScope}
        timeConfig={timeConfig}
        groupByTag={{ name: 'endpoint.name', entity: entityTypes.DESTINATION }}
      />
    </>
  );
}

function renderButtonLineSecondary({ applicationId, serviceId, timeConfig }) {
  return (
    <>
      <InstanaServiceToCloudfoundryApplicationButton
        applicationId={applicationId}
        serviceId={serviceId}
        timeConfig={timeConfig}
      />
      {hasKubernetesAccess && (
        <InstanaServiceToKubernetesServicesButton
          applicationId={applicationId}
          serviceId={serviceId}
          timeConfig={timeConfig}
        />
      )}
    </>
  );
}

function renderMetaInformation({ result }) {
  return (
    <>
      <EndpointTypeBadgeList types={result.data.types} />
      <TechnologyIndicatorList technologies={result.data.technologies} responsive={false} />
    </>
  );
}

function renderApplicationContext(props) {
  return <ApplicationSwitcherContext {...props} />;
}
