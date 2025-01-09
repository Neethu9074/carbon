/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  configurationTabFullyQualified,
  configurationOptionsFullyQualified,
  configurationPrivacyFullyQualified,
  configurationSymbolFilesFullyQualified,
  configurationCustomGeoDetailsFullyQualified
} from 'in-mobile-apps/navigation/paths';
import StackTraceTranslation from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Options/StackTraceTranslation/StackTraceTranslation';
import MobileAppCustomGeoDetails from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Options/MobileAppCustomGeoDetails';
import StickySidebarNavigationAndContent from 'in-components/layout/SideNavigationAndContent';
import Options from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Options/Options';
import Privacy from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Options/Privacy';
import { mobileAppCrashBeaconEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export default function Configuration(props) {
  const getPages = () => {
    let pages = [
      {
        label: t('in-mobile-apps:dashboard.tabs.optionsLabel'),
        path: configurationOptionsFullyQualified,
        component: () => <Options {...props} />
      },
      {
        label: t('in-mobile-apps:dashboard.tabs.privacyLabel'),
        path: configurationPrivacyFullyQualified,
        component: () => <Privacy {...props} />
      },
      {
        label: t('in-mobile-apps:dashboard.tabs.customGeoDetailsLabel'),
        path: configurationCustomGeoDetailsFullyQualified,
        component: () => <MobileAppCustomGeoDetails {...props} />
      }
    ];
    if (mobileAppCrashBeaconEnabled) {
      let page = {
        label: t('in-mobile-apps:dashboard.tabs.configurations.symbolFileConfigLabel'),
        path: configurationSymbolFilesFullyQualified,
        component: () => <StackTraceTranslation {...props} />
      };
      pages.splice(2, 0, page);
    }

    return pages;
  };
  return (
    <StickySidebarNavigationAndContent
      navigationTree={[
        {
          title: t('in-mobile-apps:dashboard.tabs.configurationTitle'),
          pages: getPages()
        }
      ]}
      redirectToDefaultPage={configurationOptionsFullyQualified}
      redirectFrom={configurationTabFullyQualified}
      {...props}
    />
  );
}
