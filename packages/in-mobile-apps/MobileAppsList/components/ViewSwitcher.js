import React from 'react';

import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeader from 'in-new-components/DashboardHeader';

export default function KubernetesViewSwitcher() {
  return (
    <>
      <DashboardHeader icon="lib_website_inverted" label="Mobile Apps" title="Mobile Apps" />
      <DashboardHeaderShadowModule />
    </>
  );
}
