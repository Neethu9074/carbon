import React from 'react';

import { applicationId, serviceId, endpointId } from 'in-applications/navigation/matrix';
import InfrastructureTab from 'in-applications/Dashboards/commonTabs/Infrastructure';
import { applicationDashboard } from 'in-applications/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';

export default function Infrastructure({ location, timeframe }) {
  return (
    <InfrastructureTab
      applicationId={getMatrixParameter(location, applicationDashboard, applicationId)}
      serviceId={getMatrixParameter(location, applicationDashboard, serviceId)}
      endpointId={getMatrixParameter(location, applicationDashboard, endpointId)}
      timeframe={timeframe}
    />
  );
}
