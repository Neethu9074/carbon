import React from 'react';

import ServiceTopList from 'in-applications/Dashboards/application/tabs/Summary/ServiceTopList';
import TraceTopList from 'in-applications/Dashboards/application/tabs/Summary/TraceTopList';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';

export default function Summary({ data, timeframe }) {
  const application = data;

  return (
    <MaxWidthFullscreenContainer>
      <DashboardSection title="Top Services">
        <ServiceTopList application={application} timeframe={timeframe} />
      </DashboardSection>

      <DashboardSection title="Top Traces">
        <TraceTopList application={application} timeframe={timeframe} />
      </DashboardSection>
    </MaxWidthFullscreenContainer>
  );
}
