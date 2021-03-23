/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';
import { get } from 'lodash';
import React from 'react';

import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import { endpointDashboard, summaryTab, errorMessagesTab, logMessagesTab } from 'in-applications/navigation/paths';
import ApplicationContextIcon from 'in-applications/components/ApplicationSwitcherContext/ApplicationContextIcon';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import InboundAllCallsDropdown from 'in-applications/Dashboards/commonComponents/InboundAllCallsDropdown';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import { isSyntheticOption } from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import FloatingActionButtons from 'in-new-components/FloatingActionButton/FloatingActionButtons';
import CreateSmartAlert from 'in-alerting/smart-alerts/applications/components/CreateSmartAlert';
import { applicationSmartAlertsEnabled, syntheticCallsEnabled } from 'in-services/featureFlags';
import ApplicationSwitcherContext from 'in-applications/components/ApplicationSwitcherContext';
import ServiceContextIcon from 'in-applications/components/ServiceContext/ServiceContextIcon';
import IncludeSyntheticCallsDropdown from '../commonComponents/IncludeSyntheticCallsDropdown';
import { endpointDashboardUrlParameters } from 'in-applications/navigation/urlParameters';
import AnalyzeCallsButton from 'in-applications/components/AnalyzeCallsButton';
import TimeShiftDropdown from 'in-new-components/TimeShift/TimeShiftDropdown';
import { applicationTimeShiftSelectTracker } from 'in-applications/tracker';
import getApplication from 'in-subscription/application/getApplication';
import ServiceContext from 'in-applications/components/ServiceContext';
import ContextGuide from 'in-new-components/ContextGuide/ContextGuide';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import getEndpoint from 'in-subscription/application/getEndpoint';
import tabs from 'in-applications/Dashboards/endpoint/tabs/index';
import DashboardHeader from 'in-new-components/DashboardHeader';
import { getTimeShiftLabel } from 'in-stores/time/shifting';
import { boundaryScopes } from 'in-applications/constants';
import { entityTypes } from 'in-analyze/applicationFilter';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';
import Footer from 'in-new-components/Footer';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

const urlStateDefinition = {
  bind: [
    endpointDashboardUrlParameters.applicationId,
    endpointDashboardUrlParameters.serviceId,
    endpointDashboardUrlParameters.endpointId,
    endpointDashboardUrlParameters.boundaryScope,
    endpointDashboardUrlParameters.syntheticCalls
  ]
};

export default function EndpointDashboard({ location }) {
  const [{ appId, serviceId, endpointId, boundaryScope, syntheticCalls }, setUrlState] = useUrlState(
    urlStateDefinition
  );
  const timeConfig = useTimeConfig();

  const props = {
    applicationId: appId,
    serviceId,
    endpointId,
    boundaryScope,
    viewPath: endpointDashboard,
    currentTab: location.pathname.substr(location.pathname.lastIndexOf('/')),
    onChange: setUrlState,
    timeConfig,
    onBoundaryStateChange: setUrlState,
    syntheticCalls,
    onSyntheticCallsStateChange: setUrlState,
    location
  };

  const missingBoundaryScope = props.applicationId && !props.boundaryScope;
  function getBoundaryScope([id, _missingBoundaryScope]) {
    return _missingBoundaryScope && getApplication({ id });
  }
  const application = useObservable(getBoundaryScope, [props.applicationId, missingBoundaryScope]);

  if (missingBoundaryScope) {
    // as long as the boundaryScope is not loaded use the default scope
    props.boundaryScope = application?.data?.boundaryScope || boundaryScopes.default;
  }

  // In context guide stack on application dashboards, serviceIds are missing in links to endpoint
  // dashboards. Unfortunately, this is not that easy to fix, since the backend API is too generic
  // to add a "serviceId" to the result items of type "endpoint".
  // Fetch the missing serviceId, so that the service name can be shown in breadcrumbs navigation.
  // This should not trigger any additional backend request, because the same endpoint is called
  // a few lines below anyway and we are reusing the same request config object.
  const getEndpointParams = {
    id: props.endpointId,
    filter: { timeConfig }
  };
  const endpoint = useObservable(getEndpoint(getEndpointParams), [props.endpointId]);
  if (!props.serviceId) {
    props.serviceId = endpoint?.data?.serviceId;
  }

  const filterTabByResult = result =>
    get(result, ['data', 'syntheticType'], 'NON_SYNTHETIC') === 'SYNTHETIC'
      ? tab => tab.label === t('in-applications:labelSummary')
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
        result$={getEndpoint(getEndpointParams)}
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
            includeSynthetic={isSyntheticOption(props.syntheticCalls)}
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
      title={t('in-applications:labelEndpoint')}
      label={get(props.result, ['data', 'label'])}
      renderButtonLine={renderButtonLine}
      renderButtonLineSecondary={renderButtonLineSecondary}
      renderMetaInformation={renderMetaInformation}
      contextConfigurations={contextConfigurations}
    />
  );
}

function renderButtonLine({ applicationId, serviceId, endpointId, boundaryScope, timeConfig, result, syntheticCalls }) {
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
        boundaryScope={boundaryScope}
        serviceId={serviceId}
        endpointId={endpointId}
        syntheticCalls={syntheticCalls}
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
        syntheticCalls={syntheticCalls}
        area="endpoint"
      />
    </>
  );
}

function renderButtonLineSecondary({
  currentTab,
  applicationId,
  boundaryScope,
  onBoundaryStateChange,
  syntheticCalls,
  onSyntheticCallsStateChange,
  timeConfig
}) {
  return (
    <>
      <TimeShiftDropdown
        disabled={currentTab !== summaryTab}
        onChange={offset =>
          applicationTimeShiftSelectTracker({
            area: 'endpoint',
            offset: getTimeShiftLabel({ offset: offset }),
            windowSize: timeConfig.windowSize,
            autoRefresh: timeConfig.autoRefresh
          })
        }
      />
      {applicationId && (
        <InboundAllCallsDropdown
          boundaryScope={boundaryScope}
          onBoundaryStateChange={onBoundaryStateChange}
          disabled={location.pathname === '/endpoint/flowMap'}
        />
      )}
      {syntheticCallsEnabled && (
        <IncludeSyntheticCallsDropdown
          syntheticCalls={syntheticCalls}
          onSyntheticCallsStateChange={onSyntheticCallsStateChange}
          disabled={currentTab === errorMessagesTab || currentTab === logMessagesTab}
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
