import React from 'react';

import { applicationId, serviceId, endpointId } from 'in-applications/navigation/matrix';
import InfrastructureTab from 'in-applications/Dashboards/commonTabs/Infrastructure';
import { serviceDashboard } from 'in-applications/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';

export default function Infrastructure({ location, timeframe }) {
  return (
    <InfrastructureTab
      applicationId={getMatrixParameter(location, serviceDashboard, applicationId)}
      serviceId={getMatrixParameter(location, serviceDashboard, serviceId)}
      endpointId={getMatrixParameter(location, serviceDashboard, endpointId)}
      timeframe={timeframe}
    />
  );
}
