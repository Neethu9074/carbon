import React from 'react';

import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import ViewSwitcherTabs from 'in-websites/WebsitesList/components/ViewSwitcherTabs';
import DashboardHeader from 'in-new-components/DashboardHeader';

export default function KubernetesViewSwitcher() {
  return (
    <>
      <DashboardHeader icon="lib_mobile_app_inverted" label="Mobile Apps" title="Mobile Apps" />
      <ViewSwitcherTabs />
      <DashboardHeaderShadowModule />
    </>
  );
}
