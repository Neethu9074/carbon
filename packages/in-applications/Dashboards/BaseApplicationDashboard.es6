import React from 'react';

import { applicationDashboard, serviceDashboard, endpointDashboard } from 'in-applications/navigation/paths';
import { applicationId, serviceId, endpointId } from 'in-applications/navigation/matrix';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import TabView from 'in-applications/TabView/TabView';
import { timeframe$ } from 'in-stores/timeline';

export default function BaseApplicationDashboard({ location, breadcrumbs, tabs, dashboardBasedUrl, get }) {
  const applicationIdFromMatrix = getMatrixParameter(location, applicationDashboard, applicationId);
  const serviceIdFromMatrix = getMatrixParameter(location, serviceDashboard, serviceId);
  const endpointIdFromMatrix = getMatrixParameter(location, endpointDashboard, endpointId);

  return (
    <TabView
      get={() =>
        timeframe$.flatMap(timeframe =>
          get({
            timeframe,
            applicationId: applicationIdFromMatrix,
            serviceId: serviceIdFromMatrix,
            endpointId: endpointIdFromMatrix
          })
        )
      }
      dashboardBasedUrl={dashboardBasedUrl}
      breadcrumbs={breadcrumbs}
      tabs={tabs}
    />
  );
}
