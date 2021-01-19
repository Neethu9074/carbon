/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import DashboardHeaderModule, { themes } from 'in-new-components/DashboardHeader/DashboardHeaderModule';
import { hasWebsitesAccess, hasMobileAppsAccess } from 'in-stores/permission';
import { mobileAppMonitoringPath } from 'in-mobile-apps/navigation/paths';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { websiteMonitoringPath } from 'in-websites/navigation/paths';
import DashboardHeader from 'in-new-components/DashboardHeader';

export default function WebsitesAndMobileAppsViewSwitcher({ isWebsites }) {
  const hasAccessToBothAreas = hasWebsitesAccess && hasMobileAppsAccess;

  let header;
  if (hasAccessToBothAreas) {
    header = (
      <DashboardHeader
        icon="lib_website_mobile_app_inverted"
        label="Websites & Mobile Apps"
        title="Websites & Mobile Apps"
      />
    );
  } else if (isWebsites) {
    header = <DashboardHeader icon="lib_website_inverted" label="Websites" title="Websites" />;
  } else {
    header = <DashboardHeader icon="lib_mobile_app_inverted" label="Mobile Apps" title="Mobile Apps" />;
  }

  return (
    <>
      {header}
      {hasAccessToBothAreas && (
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
      )}
      <DashboardHeaderShadowModule />
    </>
  );
}
