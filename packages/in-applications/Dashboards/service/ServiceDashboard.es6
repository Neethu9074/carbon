import React from 'react';

import BasicApplicationDashboardHeader from 'in-applications/Dashboards/BasicApplicationDashboard/BasicApplicationDashboardHeader';
import { applicationId, serviceId, endpointId } from 'in-applications/navigation/matrix';
import breadcrumbs from 'in-applications/Dashboards/service/breadcrumbs';
import { serviceDashboard } from 'in-applications/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-applications/Dashboards/service/tabs/index';
import getService from 'in-subscription/application/getService';
import TabView from 'in-applications/TabView/TabView';
import { timeframe$ } from 'in-stores/timeline';

export default function ServiceDashboard({ location }) {
  return (
    <TabView
      HeaderComponent={Header}
      location={location}
      breadcrumbs={breadcrumbs}
      tabs={tabs}
      result$={getData(location)}
    />
  );
}

function getData(location) {
  return timeframe$.flatMap(timeframe =>
    getService({
      id: getMatrixParameter(location, serviceDashboard, serviceId),
      filter: {
        application: getMatrixParameter(location, serviceDashboard, applicationId),
        service: getMatrixParameter(location, serviceDashboard, serviceId),
        endpoint: getMatrixParameter(location, serviceDashboard, endpointId),
        timeframe
      }
    })
  );
}

function Header({ result }) {
  return <BasicApplicationDashboardHeader result={result} />;
}
