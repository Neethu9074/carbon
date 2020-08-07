import { get } from 'lodash';
import React from 'react';

import InstanaServiceToCloudfoundryApplicationButton from 'in-cloudfoundry/commonComponents/InstanaServiceToCloudfoundryApplicationButton';
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import ApplicationContextIcon from 'in-applications/components/ApplicationSwitcherContext/ApplicationContextIcon';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import { applicationId, serviceId, endpointId, boundaryScope } from 'in-applications/navigation/matrix';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import FloatingActionButtons from 'in-new-components/FloatingActionButton/FloatingActionButtons';
import ApplicationSwitcherContext from 'in-applications/components/ApplicationSwitcherContext';
import CreateSmartAlert from 'in-applications/alerting/components/CreateSmartAlert';
import AnalyzeCallsButton from 'in-applications/components/AnalyzeCallsButton';
import { applicationSmartAlertsEnabled } from 'in-services/featureFlags';
import ContextGuide from 'in-new-components/ContextGuide/ContextGuide';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { serviceDashboard } from 'in-applications/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-applications/Dashboards/service/tabs/index';
import getService from 'in-subscription/application/getService';
import DashboardHeader from 'in-new-components/DashboardHeader';
import { entityTypes } from 'in-analyze/applicationFilter';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Footer from 'in-new-components/Footer';
import { role } from 'in-stores/user';

export default function ServiceDashboard({ location }) {
  const timeConfig = useTimeConfig();

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
      <ViewTrackingMeta
        data={{
          productArea: 'Applications',
          pageRootName: 'Service',
          inContextOfApplication: props.applicationId != null
        }}
      />

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

  return (
    <DashboardHeader
      {...props}
      icon="lib_application_service"
      title="Service"
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
        timeConfig={timeConfig}
      />
      <ContextGuide
        id={serviceId}
        timeConfig={timeConfig}
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        productArea="service"
      />
      <AnalyzeCallsButton
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        boundaryScope={boundaryScope}
        timeConfig={timeConfig}
        groupByTag={{ name: 'endpoint.name', entity: entityTypes.DESTINATION }}
        filters={filterByType(result.data.types)}
        area="service"
      />
    </>
  );
}

function renderButtonLineSecondary({ applicationId, serviceId, timeConfig }) {
  return (
    <InstanaServiceToCloudfoundryApplicationButton
      applicationId={applicationId}
      serviceId={serviceId}
      timeConfig={timeConfig}
    />
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

function filterByType(types) {
  if (types.length === 1) {
    return [{ name: 'call.type', value: types[0], operator: 'EQUALS', entity: 'NOT_APPLICABLE' }];
  } else {
    return [];
  }
}
