/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { MenuItem } from '@instana/components';
import { just } from '@instana/observables';

import { isAnalyzeView as isMobileAppAnalyzeView, mobileAppMonitoringPath } from 'in-mobile-apps/navigation/paths';
import { isAnalyzeView as isWebsiteAnalyzeView, websiteMonitoringPath } from 'in-websites/navigation/paths';
import { hasMobileAppsAccess, hasWebsitesAccess } from 'in-stores/permission';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { all, any } from 'in-services/fixedStreams';
import { t } from 'in-i18n';

export default function WebsiteMobileAppView() {
  const { matchLocation, createHrefToPath } = useNavigation();
  const loc = useLocation();

  const showWebNavigationItem = hasWebsitesAccess;
  const showMobileAppNavigationItem = hasMobileAppsAccess;

  const isWebsiteView$ = all(
    just(matchLocation(websiteMonitoringPath)),
    isWebsiteAnalyzeView.map((v: any) => !v)
  );
  const isMobileAppView$ = all(
    just(matchLocation(mobileAppMonitoringPath)),
    isMobileAppAnalyzeView.map((v: any) => !v)
  );

  if (showWebNavigationItem && showMobileAppNavigationItem) {
    return (
      <MenuItem
        id="main-nav-websites"
        label={t('in-components:mainNavigation.viewSwitcherLabelWebsitesAndMobileApps')}
        icon="lib_website_mobile_app_inverted"
        href={createHrefToPath(websiteMonitoringPath)}
        isActive$={any(isWebsiteView$, isMobileAppView$)}
        clientLocation={loc}
      />
    );
  }

  if (showWebNavigationItem) {
    return (
      <MenuItem
        id="main-nav-websites"
        label={t('in-components:mainNavigation.viewSwitcherLabelWebsites')}
        icon="lib_website_inverted"
        href={createHrefToPath(websiteMonitoringPath)}
        isActive$={isWebsiteView$}
        clientLocation={loc}
      />
    );
  }

  if (showMobileAppNavigationItem) {
    return (
      <MenuItem
        id="main-nav-mobile-apps"
        label={t('in-components:mainNavigation.viewSwitcherLabelMobileApps')}
        icon="lib_mobile_app_inverted"
        href={createHrefToPath(mobileAppMonitoringPath)}
        isActive$={isMobileAppView$}
        clientLocation={loc}
      />
    );
  }

  return null;
}
