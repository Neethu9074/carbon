import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import HeaderWithTimeSelection from 'in-new-components/time/TimeSelection/HeaderWithTimeSelection';

export default function CloudfoundryViewSwitcher() {
  return (
    <HeaderWithTimeSelection>
      <SecondLevelNavigation>
        <SecondLevelNavigationItem icon="lib_cloudfoundry_application" label="Cloud Foundry Applications" isActive />
      </SecondLevelNavigation>
    </HeaderWithTimeSelection>
  );
}
