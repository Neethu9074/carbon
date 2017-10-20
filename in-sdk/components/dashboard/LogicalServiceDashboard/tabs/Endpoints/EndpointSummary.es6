import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import BackButton from 'in-sdk/components/dashboard/TabView/BackButton';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';

export default function EndpointSummary() {
  return (
    <MaxWidthFullscreenContainer>
      <BackButton label="Back to endpoints list" href$={getSubDashboardLink(`/ednpoints`)} />
      <DashboardTile title="Summary">Summary</DashboardTile>
    </MaxWidthFullscreenContainer>
  );
}
