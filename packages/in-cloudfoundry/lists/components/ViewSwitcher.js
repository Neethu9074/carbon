import React from 'react';

import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import TechPreviewBadge from 'in-cloudfoundry/commonComponents/TechPreviewBadge';
import DashboardHeader from 'in-new-components/DashboardHeader';

export default function CloudfoundryViewSwitcher() {
  return (
    <>
      <DashboardHeader
        icon="lib_cloudfoundry_inverted"
        label="Cloud Foundry Applications"
        title="Cloud Foundry Applications"
        renderMetaInformation={renderMetaInformation}
      />
      <DashboardHeaderShadowModule />
    </>
  );
}

function renderMetaInformation() {
  return <TechPreviewBadge />;
}
