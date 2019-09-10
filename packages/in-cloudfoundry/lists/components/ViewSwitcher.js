import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import HeaderWithTimeSelection from 'in-new-components/time/TimeSelection/HeaderWithTimeSelection';
import TechPreviewBadge from 'in-cloudfoundry/commonComponents/TechPreviewBadge';

import locals from './ViewSwitcher.mless';

export default function CloudfoundryViewSwitcher() {
  return (
    <HeaderWithTimeSelection>
      <SecondLevelNavigation>
        <SecondLevelNavigationItem icon="lib_cloudfoundry_application" label="Cloud Foundry Applications" isActive />
        <div className={locals.badgeWrapper}>
          <TechPreviewBadge />
        </div>
      </SecondLevelNavigation>
    </HeaderWithTimeSelection>
  );
}
