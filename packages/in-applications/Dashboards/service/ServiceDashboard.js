/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { useObservable } from '@instana/hooks';

import InstanaServiceToCloudfoundryApplicationButton from 'in-cloudfoundry/commonComponents/InstanaServiceToCloudfoundryApplicationButton';
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import ApplicationContextIcon from 'in-applications/components/ApplicationSwitcherContext/ApplicationContextIcon';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import InboundAllCallsDropdown from 'in-applications/Dashboards/commonComponents/InboundAllCallsDropdown';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import ApplicationSwitcherContext from 'in-applications/components/ApplicationSwitcherContext';
import InvalidUrlAlert from 'in-applications/Dashboards/commonComponents/InvalidUrlAlert';
import { serviceDashboardUrlParameters } from 'in-applications/navigation/urlParameters';
import CreateSmartAlert from 'in-alerting/smart-alerts/applications/CreateSmartAlert';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import { serviceDashboard, summaryTab } from 'in-applications/navigation/paths';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import AnalyzeCallsButton from 'in-applications/components/AnalyzeCallsButton';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import TimeShiftDropdown from 'in-components/TimeShift/TimeShiftDropdown';
import getApplication from 'in-applications/subscriptions/getApplication';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import ContextGuide from 'in-components/ContextGuide/ContextGuide';
import getService from 'in-applications/subscriptions/getService';
import { productAreas } from 'in-services/tracking/productAreas';
import TabView from 'in-components/LocationAwareTabView/TabView';
import tabs from 'in-applications/Dashboards/service/tabs/index';
import { servicesList } from 'in-applications/navigation/paths';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { getTimeShiftLabel } from 'in-stores/time/shifting';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { pageNames } from 'in-services/tracking/pageNames';
import { boundaryScopes } from 'in-applications/constants';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';
import Footer from 'in-components/Footer';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

const urlStateDefinition = {
  bind: [
    serviceDashboardUrlParameters.applicationId,
    serviceDashboardUrlParameters.serviceId,
    serviceDashboardUrlParameters.boundaryScope
  ]
};

export default function ServiceDashboard({ location }) {
  const [{ appId, serviceId, boundaryScope }, setUrlState] = useUrlState(urlStateDefinition);
  const timeConfig = useTimeConfig();

  const props = {
    applicationId: appId,
    serviceId,
    boundaryScope,
    viewPath: serviceDashboard,
    currentTab: location.pathname.substr(location.pathname.lastIndexOf('/')),
    onChange: setUrlState,
    timeConfig,
    location,
    onBoundaryStateChange: setUrlState
  };
  const { createHref } = useNavigation();

  const missingBoundaryScope = props.applicationId && !props.boundaryScope;
  function getBoundaryScope([id, _missingBoundaryScope]) {
    return _missingBoundaryScope && getApplication({ id });
  }
  const application = useObservable(getBoundaryScope, [props.applicationId, missingBoundaryScope]);
  if (missingBoundaryScope) {
    // as long as the boundaryScope is not loaded use the default scope
    props.boundaryScope = application?.data?.boundaryScope || boundaryScopes.default;
  }

  const showAlertButton = role.canConfigureApplicationSmartAlerts;

  if (!serviceId) {
    return (
      <InvalidUrlAlert
        href={createHref({ ...location, pathname: servicesList })}
        description={t('in-applications:dashboards.idNotPresent', {
          id: 'Service ID'
        })}
        linkText={t('in-applications:linkViewAllServices')}
      />
    );
  }
  return (
    <>
      <ViewTrackingMeta
        data={{
          inContextOfApplication: props.applicationId != null,
          productArea: productAreas.applications,
          pageRootName: pageNames.service_summary
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

      {showAlertButton && props.applicationId && (
        <CreateSmartAlert
          serviceId={props.serviceId}
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

  return (
    <DashboardHeader
      {...props}
      icon="lib_application_service"
      title={t('in-applications:labelService')}
      label={get(props.result, ['data', 'label'])}
      renderButtonLine={renderButtonLine}
      renderButtonLineSecondary={RenderButtonLineSecondary}
      renderMetaInformation={renderMetaInformation}
      contextConfigurations={contextConfigurations}
      showHistoricDataWarning={false}
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
        boundaryScope={boundaryScope}
        serviceId={serviceId}
        productArea="service"
      />
      <AnalyzeCallsButton
        applicationId={applicationId}
        serviceId={serviceId}
        boundaryScope={boundaryScope}
        groupBy={createGroupBy('endpoint.name', DESTINATION)}
        formModel={filterByType(result.data.types)}
        includeSynthetic={get(result, ['data', 'synthetic'])}
      />
    </>
  );
}

function RenderButtonLineSecondary({
  applicationId,
  serviceId,
  timeConfig,
  currentTab,
  boundaryScope,
  onBoundaryStateChange,
  location
}) {
  const { trackApplicationTimeShiftSelected } = useApplicationTracker();
  return (
    <>
      <InstanaServiceToCloudfoundryApplicationButton
        applicationId={applicationId}
        serviceId={serviceId}
        timeConfig={timeConfig}
      />
      <TimeShiftDropdown
        disabled={currentTab !== summaryTab}
        onChange={offset =>
          trackApplicationTimeShiftSelected({
            area: 'service',
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
  if (types.length) {
    const filterExpression = [];
    types.forEach((type, index) => {
      if (index !== 0) {
        filterExpression.push({ type: 'CONJUNCTION', logicalOperator: 'OR' });
      }
      filterExpression.push(tagFilter('call.type', EQUALS, type));
    });
    return filterExpression;
  }
}
