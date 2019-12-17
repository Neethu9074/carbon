import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import DashboardHeaderModule, { themes } from 'in-new-components/DashboardHeader/DashboardHeaderModule';
import { hasWebsitesAccess, hasMobileAppsAccess } from 'in-stores/permission';
import { mobileAppMonitoringPath } from 'in-mobile-apps/navigation/paths';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { mobileAppMonitoringEnabled } from 'in-services/featureFlags';
import { websiteMonitoringPath } from 'in-websites/navigation/paths';

export default function ViewSwitcherTabs({ isWebsites }) {
  const hasAccessToBothAreas = hasWebsitesAccess && hasMobileAppsAccess && mobileAppMonitoringEnabled;
  if (!hasAccessToBothAreas) {
    return null;
  }

  return (
    <DashboardHeaderModule theme={themes.light}>
      <SecondLevelNavigation>
        <SecondLevelNavigationItem
          href$={getModifiedUrlStream(p => (p.pathname = websiteMonitoringPath))}
          icon="lib_website"
          label="Websites"
          isActive={isWebsites}
        />
        <SecondLevelNavigationItem
          href$={getModifiedUrlStream(p => (p.pathname = mobileAppMonitoringPath))}
          icon="lib_mobile_app"
          label="Mobile Apps"
          isActive={!isWebsites}
        />
      </SecondLevelNavigation>
    </DashboardHeaderModule>
  );
}
