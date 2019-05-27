import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import HeaderWithTimeSelection from 'in-new-components/time/TimeSelection/HeaderWithTimeSelection';

export default function KubernetesViewSwitcher() {
  return (
    <HeaderWithTimeSelection>
      <SecondLevelNavigation>
        <SecondLevelNavigationItem icon="lib_website" label="Websites" isActive />
      </SecondLevelNavigation>
    </HeaderWithTimeSelection>
  );
}
