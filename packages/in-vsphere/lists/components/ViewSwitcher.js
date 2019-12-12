import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule, { themes } from 'in-new-components/DashboardHeader/DashboardHeaderModule';
import { datacenterListFullyQualified } from 'in-vsphere/navigation/paths';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import DashboardHeader from 'in-new-components/DashboardHeader';

export default function VSphereViewSwitcher() {
  return (
    <>
      <DashboardHeader icon="lib_vsphere_inverted" label="VSphere" title="VSphere" />
      <DashboardHeaderModule theme={themes.light}>
        <SecondLevelNavigation>
          <SecondLevelNavigationItem
            href$={getModifiedUrlStream(p => (p.pathname = datacenterListFullyQualified))}
            icon="lib_vsphere_cluster"
            label="vSphere Clusters"
            isActive
          />
        </SecondLevelNavigation>
      </DashboardHeaderModule>
      <DashboardHeaderShadowModule />
    </>
  );
}
