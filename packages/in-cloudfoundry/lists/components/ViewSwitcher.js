import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule, { themes } from 'in-new-components/DashboardHeader/DashboardHeaderModule';
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
      <DashboardHeaderModule theme={themes.light}>
        <SecondLevelNavigation>
          <SecondLevelNavigationItem icon="lib_cloudfoundry_application" label="Cloud Foundry Applications" isActive />
        </SecondLevelNavigation>
      </DashboardHeaderModule>
      <DashboardHeaderShadowModule />
    </>
  );
}

function renderMetaInformation() {
  return <TechPreviewBadge />;
}
