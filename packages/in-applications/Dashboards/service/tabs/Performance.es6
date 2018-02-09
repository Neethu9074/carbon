import React from 'react';

import { applicationId, serviceId, endpointId } from 'in-applications/navigation/matrix';
import PerformanceTab from 'in-applications/Dashboards/commonTabs/performance/Performance';
import { serviceDashboard } from 'in-applications/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';

export default function Performance({ location, timeframe }) {
  return (
    <PerformanceTab
      applicationId={getMatrixParameter(location, serviceDashboard, applicationId)}
      serviceId={getMatrixParameter(location, serviceDashboard, serviceId)}
      endpointId={getMatrixParameter(location, serviceDashboard, endpointId)}
      timeframe={timeframe}
    />
  );
}
