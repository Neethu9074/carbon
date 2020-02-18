import React from 'react';

import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeader from 'in-new-components/DashboardHeader';

export default function CloudfoundryViewSwitcher() {
  return (
    <>
      <DashboardHeader
        icon="lib_cloudfoundry_inverted"
        label="Cloud Foundry Applications"
        title="Cloud Foundry Applications"
      />
      <DashboardHeaderShadowModule />
    </>
  );
}
