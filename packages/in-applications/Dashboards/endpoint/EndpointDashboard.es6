import React, { Fragment } from 'react';

import BasicApplicationDashboardHeader from 'in-applications/Dashboards/BasicApplicationDashboard/BasicApplicationDashboardHeader';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import { applicationId, serviceId, endpointId } from 'in-applications/navigation/matrix';
import applicationBreadcrumbs from 'in-applications/breadcrumbs/applicationBreadcrumbs';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import { endpointDashboard } from 'in-applications/navigation/paths';
import TracesButton from 'in-applications/components/TracesButton';
import getEndpoint from 'in-subscription/application/getEndpoint';
import tabs from 'in-applications/Dashboards/endpoint/tabs/index';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import TabView from 'in-applications/TabView/TabView';
import { timeframe$ } from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

export default connectTo({ timeframe: timeframe$ }, function EndpointDashboard({ location, timeframe }) {
  const props = {
    applicationId: getMatrixParameter(location, endpointDashboard, applicationId),
    serviceId: getMatrixParameter(location, endpointDashboard, serviceId),
    endpointId: getMatrixParameter(location, endpointDashboard, endpointId),
    viewPath: endpointDashboard,
    timeframe
  };
  return (
    <Fragment>
      <Breadcrumbs items={applicationBreadcrumbs(props)} />
      <TabView
        result$={getEndpoint({
          id: props.endpointId,
          filter: {
            application: props.applicationId,
            service: props.serviceId,
            endpoint: props.endpointId,
            timeframe
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

function Actions({ applicationId, serviceId, endpointId, timeframe }) {
  return (
    <TracesButton applicationId={applicationId} serviceId={serviceId} endpointId={endpointId} timeframe={timeframe} />
  );
}

function SubTypes({ result }) {
  return <EndpointTypeBadgeList types={[result.data.type]} />;
}
