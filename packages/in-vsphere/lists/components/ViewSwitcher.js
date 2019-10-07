import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import { datacenterListFullyQualified } from 'in-vsphere/navigation/paths';
import HeaderWithTimeSelection from 'in-new-components/time/TimeSelection/HeaderWithTimeSelection';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';

export default function VSphereViewSwitcher() {
  return (
    <HeaderWithTimeSelection>
      <SecondLevelNavigation>
        <SecondLevelNavigationItem
          href$={getModifiedUrlStream(p => (p.pathname = datacenterListFullyQualified))}
          icon="lib_kubernetes_cluster" //should be changed to VSphereDatacenter
          label="Datacenters"
          isActive
        />
      </SecondLevelNavigation>
    </HeaderWithTimeSelection>
  );
}
