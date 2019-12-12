import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule, { themes } from 'in-new-components/DashboardHeader/DashboardHeaderModule';
import DashboardHeader from 'in-new-components/DashboardHeader';

export default function KubernetesViewSwitcher() {
  return (
    <>
      <DashboardHeader icon="lib_website_inverted" label="Websites" title="Websites" />
      <DashboardHeaderModule theme={themes.light}>
        <SecondLevelNavigation>
          <SecondLevelNavigationItem icon="lib_website" label="Websites" isActive />
        </SecondLevelNavigation>
      </DashboardHeaderModule>
      <DashboardHeaderShadowModule />
    </>
  );
}
