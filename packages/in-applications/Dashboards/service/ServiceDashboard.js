import { get } from 'lodash';
import React from 'react';

import InstanaServiceToCloudfoundryApplicationButton from 'in-cloudfoundry/commonComponents/InstanaServiceToCloudfoundryApplicationButton';
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import ApplicationContextIcon from 'in-applications/components/ApplicationSwitcherContext/ApplicationContextIcon';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import InboundAllCallsDropdown from 'in-applications/Dashboards/commonComponents/InboundAllCallsDropdown';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import FloatingActionButtons from 'in-new-components/FloatingActionButton/FloatingActionButtons';
import ApplicationSwitcherContext from 'in-applications/components/ApplicationSwitcherContext';
import { serviceDashboardUrlParameters } from 'in-applications/navigation/urlParameters';
import CreateSmartAlert from 'in-applications/alerting/components/CreateSmartAlert';
import { serviceDashboard, summaryTab } from 'in-applications/navigation/paths';
import AnalyzeCallsButton from 'in-applications/components/AnalyzeCallsButton';
import TimeShiftDropdown from 'in-new-components/TimeShift/TimeShiftDropdown';
import { applicationSmartAlertsEnabled } from 'in-services/featureFlags';
import getApplication from 'in-subscription/application/getApplication';
import ContextGuide from 'in-new-components/ContextGuide/ContextGuide';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import tabs from 'in-applications/Dashboards/service/tabs/index';
import getService from 'in-subscription/application/getService';
import DashboardHeader from 'in-new-components/DashboardHeader';
import { entityTypes } from 'in-analyze/applicationFilter';
import { boundaryScopes } from 'in-applications/constants';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
import useUrlState from 'in-hooks/useUrlState';
import Footer from 'in-new-components/Footer';
import { empty } from 'reactive-observables';
import { role } from 'in-stores/user';

export default function ServiceDashboard({ location }) {
  const [urlState, setUrlState] = useUrlState({
    bind: [
      serviceDashboardUrlParameters.applicationId,
      serviceDashboardUrlParameters.serviceId,
      serviceDashboardUrlParameters.boundaryScope
    ]
  });
  const timeConfig = useTimeConfig();

  const props = {
    applicationId: urlState.appId,
    serviceId: urlState.serviceId,
    boundaryScope: urlState.boundaryScope,
    viewPath: serviceDashboard,
    currentTab: location.pathname.substr(location.pathname.lastIndexOf('/')),
    onChange: setUrlState,
    timeConfig,
    location,
    onBoundaryStateChange: setUrlState
  };

  const missingBoundaryScope = props.applicationId && !props.boundaryScope;
  const application = useObservable(missingBoundaryScope ? getApplication({ id: props.applicationId }) : empty, [
    props.applicationId
  ]);
  if (missingBoundaryScope) {
    // as long as the boundaryScope is not loaded use the default scope
    props.boundaryScope = application?.data?.boundaryScope || boundaryScopes.default;
  }

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
            timeConfig
          }
        })}
        props={props}
      />

      {role.canConfigureCustomAlerts && applicationSmartAlertsEnabled && (
        <FloatingActionButtons>
          <CreateSmartAlert
            serviceId={props.serviceId}
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

function renderButtonLine({ applicationId, serviceId, boundaryScope, timeConfig, result }) {
  return (
    <>
      <ApplicationEntityHealthIndicatorBehavior
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        applicationId={applicationId}
        serviceId={serviceId}
        timeConfig={timeConfig}
      />
      <ContextGuide
        id={serviceId}
        timeConfig={timeConfig}
        applicationId={applicationId}
        serviceId={serviceId}
        productArea="service"
      />
      <AnalyzeCallsButton
        applicationId={applicationId}
        serviceId={serviceId}
        boundaryScope={boundaryScope}
        timeConfig={timeConfig}
        groupByTag={{ name: 'endpoint.name', entity: entityTypes.DESTINATION }}
        filters={filterByType(result.data.types)}
        area="service"
      />
    </>
  );
}

function renderButtonLineSecondary({
  applicationId,
  serviceId,
  timeConfig,
  currentTab,
  boundaryScope,
  onBoundaryStateChange,
  location
}) {
  return (
    <>
      <InstanaServiceToCloudfoundryApplicationButton
        applicationId={applicationId}
        serviceId={serviceId}
        timeConfig={timeConfig}
      />
      <TimeShiftDropdown disabled={currentTab !== summaryTab} />
      {applicationId && (
        <InboundAllCallsDropdown
          boundaryScope={boundaryScope}
          onBoundaryStateChange={onBoundaryStateChange}
          disabled={location.pathname === '/service/flowMap'}
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

function filterByType(types) {
  if (types.length === 1) {
    return [{ name: 'call.type', value: types[0], operator: 'EQUALS', entity: 'NOT_APPLICABLE' }];
  } else {
    return [];
  }
}
