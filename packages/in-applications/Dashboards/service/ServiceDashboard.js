import React, { Fragment } from 'react';

import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import InstanaServiceToKubernetesServicesButton from 'in-kubernetes/components/InstanaServiceToKubernetesServicesButton';
import InboundOrAllCallsNotification from 'in-applications/Dashboards/commonComponents/InboundOrAllCallsNotification';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import { applicationId, serviceId, endpointId, boundaryScope } from 'in-applications/navigation/matrix';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import { getServiceDashboard, serviceDashboard } from 'in-applications/navigation/paths';
import { ServiceBreadcrumbs } from 'in-applications/breadcrumbs/applicationBreadcrumbs';
import AnalyzeCallsButton from 'in-applications/components/AnalyzeCallsButton';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-applications/Dashboards/service/tabs/index';
import getService from 'in-subscription/application/getService';
import { hasKubernetesAccess } from 'in-stores/permission';
import { switchScope } from 'in-applications/constants';
import { entityTypes } from 'in-analyze/applicationFilter';
import { timeConfig$ } from 'in-stores/time/config';
import Footer from 'in-new-components/Footer';
import connectTo from 'in-hoc/connectTo';

import locals from './ServiceDashboard.mless';

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
    <Fragment>
      <Breadcrumbs items={ServiceBreadcrumbs(props)} />
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
    </Fragment>
  );
});

function Header(props) {
  const { applicationId, serviceId, boundaryScope, currentTab } = props;
  return (
    <Fragment>
      {applicationId &&
        currentTab !== '/flowMap' && (
          <div className={locals.messageWrapper}>
            <InboundOrAllCallsNotification
              applicationId={applicationId}
              boundaryScope={boundaryScope}
              entityType="service"
              switchTo={getServiceDashboard(serviceId, {
                applicationId,
                boundaryScope: switchScope(boundaryScope),
                tab: currentTab
              })}
            />
          </div>
        )}

      <BasicDashboardHeader
        title="Service"
        icon="lib_application_service"
        renderActions={Actions}
        renderSubTypes={SubTypes}
        {...props}
      />
    </Fragment>
  );
}

function Actions({ applicationId, serviceId, endpointId, boundaryScope, timeConfig }) {
  return (
    <Fragment>
      <AnalyzeCallsButton
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        boundaryScope={boundaryScope}
        timeConfig={timeConfig}
        groupByTag={{ name: 'endpoint.name', entity: entityTypes.DESTINATION }}
      />
      {hasKubernetesAccess && (
        <InstanaServiceToKubernetesServicesButton
          applicationId={applicationId}
          serviceId={serviceId}
          timeConfig={timeConfig}
        />
      )}
      <ApplicationEntityHealthIndicatorBehavior
        showOkayOnNoIssues={false}
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        timeConfig={timeConfig}
      />
    </Fragment>
  );
}

function SubTypes({ result }) {
  return (
    <Fragment>
      <EndpointTypeBadgeList types={result.data.types} />
      <TechnologyIndicatorList technologies={result.data.technologies} responsive={false} />
    </Fragment>
  );
}
