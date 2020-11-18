import React from 'react';

import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import UseBeeInstantToggle from 'in-infrastructure/Dashboard/components/UseBeeInstantToggle';
import DashboardHeader from 'in-new-components/DashboardHeader';

export default function VSphereViewSwitcher() {
  return (
    <>
      <DashboardHeader
        icon="lib_vsphere_inverted"
        label="vSphere Datacenters"
        title="vSphere Datacenters"
        renderTopLevelButtonLine={UseBeeInstantToggle}
      />
      <DashboardHeaderShadowModule />
    </>
  );
}
