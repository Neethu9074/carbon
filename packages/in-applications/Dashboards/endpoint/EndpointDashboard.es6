import React from 'react';

import BasicApplicationDashboardHeader from 'in-applications/Dashboards/BasicApplicationDashboard/BasicApplicationDashboardHeader';
import { applicationId, serviceId, endpointId } from 'in-applications/navigation/matrix';
import getEndpoint from 'in-subscription/application/getEndpoint';
import { endpointDashboard } from 'in-applications/navigation/paths';
import tabs from 'in-applications/Dashboards/endpoint/tabs/index';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import TabView from 'in-applications/TabView/TabView';
import { timeframe$ } from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

export default connectTo({ timeframe: timeframe$ }, function EndpointDashboard({ location, timeframe }) {
  const application = getMatrixParameter(location, endpointDashboard, applicationId);
  const service = getMatrixParameter(location, endpointDashboard, serviceId);
  const endpoint = getMatrixParameter(location, endpointDashboard, endpointId);

  return (
    <TabView
      result$={getData(location)}
      HeaderComponent={Header}
      location={location}
      tabs={tabs}
      props={{ timeframe, applicationId: application, serviceId: service, endpointId: endpoint }}
    />
  );
});

function getData(location) {
  return timeframe$.flatMap(timeframe =>
    getEndpoint({
      id: getMatrixParameter(location, endpointDashboard, endpointId),
      filter: {
        application: getMatrixParameter(location, endpointDashboard, applicationId),
        service: getMatrixParameter(location, endpointDashboard, serviceId),
        endpoint: getMatrixParameter(location, endpointDashboard, endpointId),
        timeframe
      }
    })
  );
}

function Header({ result }) {
  return <BasicApplicationDashboardHeader type="endpoint" result={result} />;
}
