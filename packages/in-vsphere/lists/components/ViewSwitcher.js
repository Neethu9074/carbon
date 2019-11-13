import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import HeaderWithTimeSelection from 'in-new-components/time/TimeSelection/HeaderWithTimeSelection';
import { datacenterListFullyQualified } from 'in-vsphere/navigation/paths';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';

export default function VSphereViewSwitcher() {
  return (
    <HeaderWithTimeSelection>
      <SecondLevelNavigation>
        <SecondLevelNavigationItem
          href$={getModifiedUrlStream(p => (p.pathname = datacenterListFullyQualified))}
          icon="lib_vsphere_cluster"
          label="vSphere Clusters"
          isActive
        />
      </SecondLevelNavigation>
    </HeaderWithTimeSelection>
  );
}
