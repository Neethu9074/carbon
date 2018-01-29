import React from 'react';

import BasicApplicationDashboardWrapper from 'in-applications/Dashboards/BasicApplicationDashboard/BasicApplicationDashboardWrapper';
import BasicApplicationDashboardHeader from 'in-applications/Dashboards/BasicApplicationDashboard/BasicApplicationDashboardHeader';
import breadcrumbs from 'in-applications/Dashboards/service/breadcrumbs';
import { serviceDashboard } from 'in-applications/navigation/paths';
import tabs from 'in-applications/Dashboards/service/tabs/index';
import getService from 'in-subscription/application/getService';

export default function ServiceDashboard({ location }) {
  return (
    <BasicApplicationDashboardWrapper
      get={({ timeframe, serviceId }) =>
        getService({
          id: serviceId,
          filter: {
            serviceName: serviceId,
            timeframe
          }
        })
      }
      HeaderComponent={Header}
      location={location}
      dashboardBasedUrl={serviceDashboard}
      breadcrumbs={breadcrumbs}
      tabs={tabs}
    />
  );
}

function Header({ result }) {
  return <BasicApplicationDashboardHeader type="service" label={result.data ? result.data.label : null} />;
}
