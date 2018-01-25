import React from 'react';

import DataRetrievalAwareDashboard from 'in-applications/Dashboards/DataRetrievalAwareDashboard';
import { serviceDashboard } from 'in-applications/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import getService from 'in-subscription/application/getService';
import { serviceId } from 'in-applications/navigation/matrix';

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
      type="service"
    />
  );
}
