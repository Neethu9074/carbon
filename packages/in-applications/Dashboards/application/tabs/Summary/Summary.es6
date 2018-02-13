import React from 'react';

import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import ServiceTopList from 'in-applications/Dashboards/application/tabs/Summary/ServiceTopList';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import TraceTopList from 'in-applications/Dashboards/commonComponents/TraceTopList';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';

export default function Summary({ timeframe, applicationId }) {
  return (
    <MaxWidthFullscreenContainer>
      <DashboardSection title="Performance Breakdown">
        <TechnologyBreakdown applicationId={applicationId} timeframe={timeframe} />
      </DashboardSection>

      <DashboardSection title="Top Services">
        <ServiceTopList applicationId={applicationId} timeframe={timeframe} />
      </DashboardSection>

      <DashboardSection title="Top Traces">
        <TraceTopList applicationId={applicationId} timeframe={timeframe} />
      </DashboardSection>
    </MaxWidthFullscreenContainer>
  );
}
