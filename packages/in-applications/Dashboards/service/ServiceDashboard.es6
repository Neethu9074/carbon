import React, { Fragment } from 'react';

import BasicApplicationDashboardHeader from 'in-applications/Dashboards/BasicApplicationDashboard/BasicApplicationDashboardHeader';
import { applicationId, serviceId, endpointId } from 'in-applications/navigation/matrix';
import applicationBreadcrumbs from 'in-applications/breadcrumbs/applicationBreadcrumbs';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import { serviceDashboard } from 'in-applications/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-applications/Dashboards/service/tabs/index';
import getService from 'in-subscription/application/getService';
import TabView from 'in-applications/TabView/TabView';
import { timeframe$ } from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

export default connectTo({ timeframe: timeframe$ }, function ServiceDashboard({ location, timeframe }) {
  const application = getMatrixParameter(location, serviceDashboard, applicationId);
  const service = getMatrixParameter(location, serviceDashboard, serviceId);
  const endpoint = getMatrixParameter(location, serviceDashboard, endpointId);

  return (
    <Fragment>
      <Breadcrumbs items={applicationBreadcrumbs(location, timeframe, true)} />
      <TabView
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        result$={getData(location, application, service, endpoint)}
        props={{ timeframe, applicationId: application, serviceId: service, endpointId: endpoint }}
      />
    </Fragment>
  );
});

function getData(location, application, service, endpoint) {
  return timeframe$.flatMap(timeframe =>
    getService({
      id: getMatrixParameter(location, serviceDashboard, serviceId),
      filter: {
        application,
        service,
        endpoint,
        timeframe
      }
    })
  );
}

function Header({ result }) {
  return <BasicApplicationDashboardHeader result={result} />;
}
