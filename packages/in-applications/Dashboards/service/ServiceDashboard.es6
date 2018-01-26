import React from 'react';

import tabsAndBreadcrumbs from 'in-applications/Dashboards/service/tabs/index';
import { serviceDashboard } from 'in-applications/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import getService from 'in-subscription/application/getService';
import { serviceId } from 'in-applications/navigation/matrix';
import TabView from 'in-applications/TabView/TabView';

export default function ServiceDashboard({ location }) {
  const serviceIdFromMatrix = getMatrixParameter(location, serviceDashboard, serviceId);
  return (
    <TabView
      get={() =>
        getService({
          id: serviceIdFromMatrix,
          filter: {
            serviceName: serviceIdFromMatrix,
            timeframe: { windowSize: 60000 }
          }
        })
      }
      dashboardBasedUrl={serviceDashboard}
      {...tabsAndBreadcrumbs}
    />
  );
}
