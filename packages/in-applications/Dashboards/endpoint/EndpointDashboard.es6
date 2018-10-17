import React, { Fragment } from 'react';
import { get } from 'lodash';

import BasicApplicationDashboardHeader from 'in-applications/Dashboards/BasicApplicationDashboard/BasicApplicationDashboardHeader';
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import { applicationId, serviceId, endpointId } from 'in-applications/navigation/matrix';
import { EndpointBreadcrumbs } from 'in-applications/breadcrumbs/applicationBreadcrumbs';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import { endpointDashboard } from 'in-applications/navigation/paths';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import getEndpoint from 'in-subscription/application/getEndpoint';
import tabs from 'in-applications/Dashboards/endpoint/tabs/index';
import CallsButton from 'in-applications/components/CallsButton';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo({ timeConfig: timeConfig$ }, function EndpointDashboard({ location, timeConfig }) {
  const props = {
    applicationId: getMatrixParameter(location, endpointDashboard, applicationId),
    serviceId: getMatrixParameter(location, endpointDashboard, serviceId),
    endpointId: getMatrixParameter(location, endpointDashboard, endpointId),
    viewPath: endpointDashboard,
    timeConfig
  };
  return (
    <Fragment>
      <Breadcrumbs items={EndpointBreadcrumbs(props)} />
      <TabView
        result$={getEndpoint({
          id: props.endpointId,
          filter: {
            application: props.applicationId,
            service: props.serviceId,
            endpoint: props.endpointId,
            timeConfig
          }
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
      />
    </Fragment>
  );
});

function Header(props) {
  return (
    <BasicApplicationDashboardHeader type="Endpoint" renderActions={Actions} renderSubTypes={SubTypes} {...props} />
  );
}

function Actions({ applicationId, serviceId, endpointId, timeConfig, result }) {
  return (
    <Fragment>
      <CallsButton
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        timeConfig={timeConfig}
        backButtonLabels={{
          label1: 'Endpoint',
          label2: result.data ? result.data.label : 'Dashboard'
        }}
      />
      <ApplicationEntityHealthIndicatorBehavior
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        resolvedEndpointId={get(result, ['data', 'id'])}
        timeConfig={timeConfig}
      />
    </Fragment>
  );
}

function SubTypes({ result }) {
  return (
    <Fragment>
      <EndpointTypeBadgeList types={[result.data.type]} />
      <TechnologyIndicatorList technologies={result.data.technologies} responsive={false} />
    </Fragment>
  );
}
