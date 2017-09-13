import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import ButtonSection from 'in-forge/plugins/instanaAgent/Dashboard/ButtonSection';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';

export default function Management({ snapshot }) {
  return (
    <MaxWidthFullscreenContainer>
      <DashboardTile title="Agent Management">
        <ButtonSection snapshot={snapshot} />
      </DashboardTile>
    </MaxWidthFullscreenContainer>
  );
}
