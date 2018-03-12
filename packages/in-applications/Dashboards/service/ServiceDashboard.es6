import React, { Fragment } from 'react';

import BasicApplicationDashboardHeader from 'in-applications/Dashboards/BasicApplicationDashboard/BasicApplicationDashboardHeader';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import { applicationId, serviceId, endpointId } from 'in-applications/navigation/matrix';
import { ServiceBreadcrumbs } from 'in-applications/breadcrumbs/applicationBreadcrumbs';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import { serviceDashboard } from 'in-applications/navigation/paths';
import TracesButton from 'in-applications/components/TracesButton';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-applications/Dashboards/service/tabs/index';
import getService from 'in-subscription/application/getService';
import TabView from 'in-new-components/TabView/TabView';
import { timeframe$ } from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

export default connectTo({ timeframe: timeframe$ }, function ServiceDashboard({ location, timeframe }) {
  const props = {
    applicationId: getMatrixParameter(location, serviceDashboard, applicationId),
    serviceId: getMatrixParameter(location, serviceDashboard, serviceId),
    endpointId: getMatrixParameter(location, serviceDashboard, endpointId),
    viewPath: serviceDashboard,
    timeframe
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
            timeframe
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

function Actions({ applicationId, serviceId, endpointId, timeframe }) {
  return (
    <TracesButton applicationId={applicationId} serviceId={serviceId} endpointId={endpointId} timeframe={timeframe} />
  );
}

function SubTypes({ result }) {
  return <EndpointTypeBadgeList types={result.data.types} />;
}
