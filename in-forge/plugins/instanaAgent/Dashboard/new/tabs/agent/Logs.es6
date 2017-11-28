import React from 'react';

import ButtonSection from 'in-forge/plugins/instanaAgent/Dashboard/new/components/ButtonSection';
import LogStreamer from 'in-forge/plugins/instanaAgent/Dashboard/new/components/LogStreamer';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';

export default function Logs({ snapshot }) {
  return (
    <MaxWidthFullscreenContainer>
      <DashboardTile title="Agent Management">
        <ButtonSection snapshot={snapshot} />
      </DashboardTile>
      <DashboardTile title="Log Output">
        <LogStreamer snapshot={snapshot} />
      </DashboardTile>
    </MaxWidthFullscreenContainer>
  );
}
