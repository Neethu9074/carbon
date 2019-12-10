import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import DashboardHeaderModule from 'in-new-components/DashboardHeader/DashboardHeaderModule';
import DashboardHeader from 'in-new-components/DashboardHeader';

export default function KubernetesViewSwitcher() {
  return (
    <>
      <DashboardHeader icon="lib_website_inverted" label="Mobile Apps" title="Mobile Apps" />
      <DashboardHeaderModule withBottomBorder>
        <SecondLevelNavigation>
          <SecondLevelNavigationItem icon="lib_website" label="Mobile Apps" isActive />
        </SecondLevelNavigation>
      </DashboardHeaderModule>
    </>
  );
}
