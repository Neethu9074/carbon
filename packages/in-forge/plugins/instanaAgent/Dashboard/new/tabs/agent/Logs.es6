import React from 'react';

import ButtonSection from 'in-forge/plugins/instanaAgent/Dashboard/new/components/ButtonSection';
import LogStreamer from 'in-forge/plugins/instanaAgent/Dashboard/new/components/LogStreamer';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';

export default function Logs({ snapshot }) {
  return (
    <MaxWidthFullscreenContainer>
      <DashboardSection title="Agent Management">
        <ButtonSection snapshot={snapshot} />
      </DashboardSection>
      <DashboardSection title="Log Output">
        <LogStreamer snapshot={snapshot} />
      </DashboardSection>
    </MaxWidthFullscreenContainer>
  );
}
