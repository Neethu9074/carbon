import React from 'react';

import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeader from 'in-new-components/DashboardHeader';

export default function VSphereViewSwitcher() {
  return (
    <>
      <DashboardHeader icon="lib_vsphere_inverted" label="vSphere Clusters" title="vSphere Clusters" />
      <DashboardHeaderShadowModule />
    </>
  );
}
