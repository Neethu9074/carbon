import React, { useEffect, useState } from 'react';
import { get } from 'lodash';

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
import { defaultTimeShift } from 'in-stores/time/shifting';
import { setTimeConfig } from 'in-stores/time/config';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { mutateUrl } from 'in-stores/navigation';
import useUrlState from 'in-hooks/useUrlState';
import Footer from 'in-new-components/Footer';
import { role } from 'in-stores/user';

export default function EndpointDashboard({ location }) {
  const [urlState, setUrlState] = useUrlState({
    bind: [
      endpointDashboardUrlParameters.applicationId,
      endpointDashboardUrlParameters.serviceId,
      endpointDashboardUrlParameters.endpointId,
      endpointDashboardUrlParameters.boundaryScope,
      endpointDashboardUrlParameters.timeShift
    ]
  });
  const timeConfig = useTimeConfig();

  // When one of the 'Last X' time ranges is used, the to timestamp is set in the backend. To be able to
  // freeze the last used time range, we need to keep track of the timestamp returned by the backed.
  const [lastUsedTimestamp, setLastUsedTimestamp] = useState(timeConfig.to);
  const props = {
    applicationId: urlState.appId,
    serviceId: urlState.serviceId,
    endpointId: urlState.endpointId,
    boundaryScope: urlState.boundaryScope,
    viewPath: endpointDashboard,
    currentTab: location.pathname.substr(location.pathname.lastIndexOf('/')),
    onChange: setUrlState,
    timeConfig,
    timeShift: urlState.timeShift,
    onUpdate: result => setLastUsedTimestamp(result?.time),
    lastUsedTimestamp,
    onBoundaryStateChange: setUrlState,
    location
  };

  useEffect(() => {
    // reset time shift, when one of the 'Last X' time ranges is selected
    if (timeConfig.to == null && props.timeShift !== defaultTimeShift.offset) {
      props.onChange({ timeShift: defaultTimeShift.offset });
    }
  }, [timeConfig.to, props.timeShift]);

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

function renderButtonLineSecondary({
  timeConfig,
  timeShift,
  onChange,
  currentTab,
  lastUsedTimestamp,
  applicationId,
  boundaryScope,
  onBoundaryStateChange
}) {
  return (
    <>
      <TimeShiftDropdown
        value={timeShift}
        onChange={e => {
          onChange(e);
          // When using time shift, freeze the time range when one of the 'Last X' time ranges is used.
          if (e.timeShift !== 0 && timeConfig.to == null) {
            const to = lastUsedTimestamp != null ? lastUsedTimestamp : Date.now();
            mutateUrl(
              location =>
                setTimeConfig(location, {
                  to: to,
                  focusedMoment: to,
                  autoRefresh: false,
                  windowSize: timeConfig.windowSize
                }),
              true
            );
          }
        }}
        timeConfig={timeConfig}
        disabled={currentTab !== summaryTab}
      />
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
