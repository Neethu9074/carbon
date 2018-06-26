import React, { Fragment } from 'react';

import BasicApplicationDashboardHeader from 'in-applications/Dashboards/BasicApplicationDashboard/BasicApplicationDashboardHeader';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import { applicationId, serviceId, endpointId } from 'in-applications/navigation/matrix';
import { ServiceBreadcrumbs } from 'in-applications/breadcrumbs/applicationBreadcrumbs';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { serviceDashboard } from 'in-applications/navigation/paths';
import TracesButton from 'in-applications/components/TracesButton';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-applications/Dashboards/service/tabs/index';
import getService from 'in-subscription/application/getService';
import { timeConfig$ } from 'in-stores/time/config';
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
    <BasicApplicationDashboardHeader type="Service" renderActions={Actions} renderSubTypes={SubTypes} {...props} />
  );
}

function Actions({ applicationId, serviceId, endpointId, timeConfig, result }) {
  return (
    <Fragment>
      <TracesButton
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        timeConfig={timeConfig}
        backButtonLabels={{
          label1: 'Service',
          label2: result.data ? result.data.label : 'Dashboard'
        }}
      />
      <ApplicationEntityHealthIndicatorBehavior
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
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
