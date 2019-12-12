import React from 'react';

import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeader from 'in-new-components/DashboardHeader';

export default function VSphereViewSwitcher() {
  return (
    <>
      <DashboardHeader icon="lib_vsphere_inverted" label="VSphere Clusters" title="VSphere Clusters" />
      <DashboardHeaderShadowModule />
    </>
  );
}
