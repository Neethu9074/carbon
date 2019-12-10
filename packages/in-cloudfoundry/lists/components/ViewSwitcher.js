import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import DashboardHeaderModule from 'in-new-components/DashboardHeader/DashboardHeaderModule';
import TechPreviewBadge from 'in-cloudfoundry/commonComponents/TechPreviewBadge';
import DashboardHeader from 'in-new-components/DashboardHeader';

export default function CloudfoundryViewSwitcher() {
  return (
    <>
      <DashboardHeader
        icon="lib_cloudfoundry_inverted"
        label="Cloud Foundry"
        title="Applications"
        renderMetaInformation={renderMetaInformation}
      />
      <DashboardHeaderModule withBottomBorder>
        <SecondLevelNavigation>
          <SecondLevelNavigationItem icon="lib_cloudfoundry_application" label="Cloud Foundry Applications" isActive />
        </SecondLevelNavigation>
      </DashboardHeaderModule>
    </>
  );
}

function renderMetaInformation() {
  return <TechPreviewBadge />;
}
