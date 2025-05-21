/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { Pill, Tooltip } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import ApplicationContextIcon from 'in-applications/components/ApplicationSwitcherContext/ApplicationContextIcon';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import InboundAllCallsDropdown from 'in-applications/Dashboards/commonComponents/InboundAllCallsDropdown';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import ApplicationSwitcherContext from 'in-applications/components/ApplicationSwitcherContext';
import ServiceContextIcon from 'in-applications/components/ServiceContext/ServiceContextIcon';
import InvalidUrlAlert from 'in-applications/Dashboards/commonComponents/InvalidUrlAlert';
import { endpointDashboardUrlParameters } from 'in-applications/navigation/urlParameters';
import CreateSmartAlert from 'in-alerting/smart-alerts/applications/CreateSmartAlert';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import { endpointDashboard, summaryTab } from 'in-applications/navigation/paths';
import AnalyzeCallsButton from 'in-applications/components/AnalyzeCallsButton';
import { useLinkToServiceDashboard } from 'in-applications/navigation/paths';
import TimeShiftDropdown from 'in-components/TimeShift/TimeShiftDropdown';
import getApplication from 'in-applications/subscriptions/getApplication';
import ServiceContext from 'in-applications/components/ServiceContext';
import getEndpoint from 'in-applications/subscriptions/getEndpoint';
import ContextGuide from 'in-components/ContextGuide/ContextGuide';
import tabs from 'in-applications/Dashboards/endpoint/tabs/index';
import { productAreas } from 'in-services/tracking/productAreas';
import TabView from 'in-components/LocationAwareTabView/TabView';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { getTimeShiftLabel } from 'in-stores/time/shifting';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { pageNames } from 'in-services/tracking/pageNames';
import { capitalize } from 'in-services/formatters/string';
import { boundaryScopes } from 'in-applications/constants';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';
import Footer from 'in-components/Footer';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

const urlStateDefinition = {
  bind: [
    endpointDashboardUrlParameters.applicationId,
    endpointDashboardUrlParameters.serviceId,
    endpointDashboardUrlParameters.endpointId,
    endpointDashboardUrlParameters.boundaryScope
  ]
};

export default function EndpointDashboard({ location }) {
  const [{ appId, serviceId, endpointId, boundaryScope }, setUrlState] = useUrlState(urlStateDefinition);
  const timeConfig = useTimeConfig();
  const getLinkToServiceDashboard = useLinkToServiceDashboard();

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
  const endpoint = useObservable(props.endpointId ? getEndpoint(getEndpointParams) : just(null), [props.endpointId]);
  if (!props.serviceId) {
    props.serviceId = endpoint?.data?.serviceId;
  }

  const filterTabByResult = result =>
    get(result, ['data', 'syntheticType'], 'NON_SYNTHETIC') === 'SYNTHETIC'
      ? tab => tab.label === t('in-applications:labelSummary')
      : () => true;

  const showAlertButton = role.canConfigureApplicationSmartAlerts;
  if (!endpointId) {
    return (
      <InvalidUrlAlert
        href={getLinkToServiceDashboard({
          applicationId: props.applicationId,
          serviceId: props.serviceId,
          boundaryScope: props.boundaryScope,
          tab: '/endpoints'
        })}
        description={t('in-applications:dashboards.idNotPresent', {
          id: 'Endpoint ID'
        })}
        linkText={t('in-applications:linkViewAllEndpoints')}
      />
    );
  }
  return (
    <>
      <ViewTrackingMeta
        data={{
          inContextOfApplication: props.applicationId != null,
          productArea: productAreas.applications,
          pageRootName: pageNames.endpoint
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

      {showAlertButton && props.applicationId && (
        <CreateSmartAlert
          serviceId={props.serviceId}
          endpointId={props.endpointId}
          applicationId={props.applicationId}
          location={location}
          boundaryScope={props.boundaryScope}
        />
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
      renderButtonLineSecondary={RenderButtonLineSecondary}
      renderMetaInformation={renderMetaInformation}
      contextConfigurations={contextConfigurations}
      showHistoricDataWarning={false}
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
        boundaryScope={boundaryScope}
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
        groupBy={createGroupBy('call.name')}
        includeSynthetic={get(result, ['data', 'synthetic'])}
      />
    </>
  );
}

function RenderButtonLineSecondary({ currentTab, applicationId, boundaryScope, onBoundaryStateChange, timeConfig }) {
  const { trackApplicationTimeShiftSelected } = useApplicationTracker();
  return (
    <>
      <TimeShiftDropdown
        disabled={currentTab !== summaryTab}
        onChange={offset =>
          trackApplicationTimeShiftSelected({
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
    </>
  );
}

function renderMetaInformation({ result }) {
  const isSynthetic = result?.data.synthetic;
  return (
    <>
      <EndpointTypeBadgeList types={[result.data.type]} />
      {isSynthetic && (
        <Tooltip
          align="leftMiddle"
          content={
            result.data.syntheticType === 'MIXED'
              ? t('in-applications:syntheticAndNonsynthetic')
              : t('in-applications:synthetic')
          }
        >
          <Pill type={'magenta'}>{capitalize(result.data.syntheticType)}</Pill>
        </Tooltip>
      )}
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
