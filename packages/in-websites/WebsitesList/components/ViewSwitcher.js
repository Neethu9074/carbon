/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule, { themes } from 'in-new-components/DashboardHeader/DashboardHeaderModule';
import { hasWebsitesAccess, hasMobileAppsAccess } from 'in-stores/permission';
import { mobileAppMonitoringPath } from 'in-mobile-apps/navigation/paths';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { websiteMonitoringPath } from 'in-websites/navigation/paths';
import DashboardHeader from 'in-new-components/DashboardHeader';
import { t } from 'in-i18n';

export default function WebsitesAndMobileAppsViewSwitcher({ isWebsites }) {
  const hasAccessToBothAreas = hasWebsitesAccess && hasMobileAppsAccess;

  let header;
  if (hasAccessToBothAreas) {
    header = (
      <DashboardHeader
        icon="lib_website_mobile_app_inverted"
        label={t('in-websites:websitesList.viewSwitcherLabelWebsitesAndMobileApps')}
        title={t('in-websites:websitesList.viewSwitcherLabelWebsitesAndMobileApps')}
      />
    );
  } else if (isWebsites) {
    header = (
      <DashboardHeader
        icon="lib_website_inverted"
        label={t('in-websites:websitesList.viewSwitcherLabelWebsites')}
        title={t('in-websites:websitesList.viewSwitcherLabelWebsites')}
      />
    );
  } else {
    header = (
      <DashboardHeader
        icon="lib_mobile_app_inverted"
        label={t('in-websites:websitesList.viewSwitcherLabelMobileApps')}
        title={t('in-websites:websitesList.viewSwitcherLabelMobileApps')}
      />
    );
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
              label={t('in-websites:websitesList.viewSwitcherLabelWebsites')}
              isActive={isWebsites}
            />
            <SecondLevelNavigationItem
              href$={getModifiedUrlStream(p => (p.pathname = mobileAppMonitoringPath))}
              icon="lib_mobile_app"
              label={t('in-websites:websitesList.viewSwitcherLabelMobileApps')}
              isActive={!isWebsites}
            />
          </SecondLevelNavigation>
        </DashboardHeaderModule>
      )}
      <DashboardHeaderShadowModule />
    </>
  );
}
