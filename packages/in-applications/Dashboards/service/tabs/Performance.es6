import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import PerformanceTab from 'in-applications/Dashboards/commonTabs/performance/Performance';
import { applicationId, serviceId, endpointId } from 'in-applications/navigation/matrix';
import { serviceDashboard } from 'in-applications/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';

export default function Performance({ location, timeframe, data }) {
  return (
    <MaxWidthFullscreenContainer>
      <PerformanceTab
        applicationId={getMatrixParameter(location, serviceDashboard, applicationId)}
        serviceId={getMatrixParameter(location, serviceDashboard, serviceId)}
        endpointId={getMatrixParameter(location, serviceDashboard, endpointId)}
        data={data}
        timeframe={timeframe}
      />
    </MaxWidthFullscreenContainer>
  );
}
