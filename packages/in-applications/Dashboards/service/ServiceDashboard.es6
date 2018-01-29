import React from 'react';

import BaseApplicationDashboard from 'in-applications/Dashboards/BaseApplicationDashboard';
import breadcrumbs from 'in-applications/Dashboards/service/breadcrumbs';
import { serviceDashboard } from 'in-applications/navigation/paths';
import tabs from 'in-applications/Dashboards/service/tabs/index';
import getService from 'in-subscription/application/getService';

export default function ServiceDashboard({ location }) {
  return (
    <BaseApplicationDashboard
      get={({ timeframe, serviceId }) =>
        getService({
          id: serviceId,
          filter: {
            serviceName: serviceId,
            timeframe
          }
        })
      }
      location={location}
      dashboardBasedUrl={serviceDashboard}
      breadcrumbs={breadcrumbs}
      tabs={tabs}
    />
  );
}
