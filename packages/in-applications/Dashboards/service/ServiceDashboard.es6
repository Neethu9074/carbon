import React from 'react';

import DataRetrievalAwareDashboard from 'in-applications/Dashboards/DataRetrievalAwareDashboard';
import serviceDashboardTabsAndBreadcrumb from 'in-applications/Dashboards/service/tabs/index';
import { serviceDashboard } from 'in-applications/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import getService from 'in-subscription/application/getService';
import { serviceId } from 'in-applications/navigation/matrix';
import TabView from 'in-sdk/components/dashboard/TabView';

export default function ServiceDashboard({ location }) {
  const serviceIdFromMatrix = getMatrixParameter(location, serviceDashboard, serviceId);
  return (
    <DataRetrievalAwareDashboard
      get={() =>
        getService({
          id: serviceIdFromMatrix,
          filter: {
            serviceName: serviceIdFromMatrix,
            timeframe: { windowSize: 60000 }
          }
        })
      }
      render={({ data }) => {
        return (
          <TabView
            subPath=""
            tabs={serviceDashboardTabsAndBreadcrumb.tabs}
            props={data}
            breadcrumbs={serviceDashboardTabsAndBreadcrumb.breadcrumbs}
          />
        );
      }}
    />
  );
}
