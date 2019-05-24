import React, { Fragment } from 'react';

import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import InstanaServiceToKubernetesServiceButton from 'in-kubernetes/components/InstanaServiceToKubernetesServiceButton';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import HistoricAndLargeDataIndicator from 'in-applications/components/HistoricAndLargeDataIndicator';
import { applicationId, serviceId, endpointId } from 'in-applications/navigation/matrix';
import { ServiceBreadcrumbs } from 'in-applications/breadcrumbs/applicationBreadcrumbs';
import AnalyzeTracesButton from 'in-applications/components/AnalyzeTracesButton';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { serviceDashboard } from 'in-applications/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-applications/Dashboards/service/tabs/index';
import getService from 'in-subscription/application/getService';
import { kubernetesEnabled } from 'in-services/featureFlags';
import { timeConfig$ } from 'in-stores/time/config';
import { hasPermission } from 'in-stores/user';
import connectTo from 'in-hoc/connectTo';

export default connectTo({ timeConfig: timeConfig$ }, function ServiceDashboard({ location, timeConfig }) {
  const props = {
    applicationId: getMatrixParameter(location, serviceDashboard, applicationId),
    serviceId: getMatrixParameter(location, serviceDashboard, serviceId),
    endpointId: getMatrixParameter(location, serviceDashboard, endpointId),
    viewPath: serviceDashboard,
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
    </Fragment>
  );
});

function Header(props) {
  return (
    <BasicDashboardHeader
      title="Service"
      icon="lib_application_service"
      renderActions={Actions}
      renderSubTypes={SubTypes}
      {...props}
    />
  );
}

function Actions({ applicationId, serviceId, endpointId, timeConfig }) {
  return (
    <Fragment>
      <AnalyzeTracesButton
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        timeConfig={timeConfig}
      />
      {kubernetesEnabled &&
        hasPermission('ACCESS_KUBERNETES') && (
          <InstanaServiceToKubernetesServiceButton serviceId={serviceId} timeConfig={timeConfig} />
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
      <HistoricAndLargeDataIndicator />
    </Fragment>
  );
}
