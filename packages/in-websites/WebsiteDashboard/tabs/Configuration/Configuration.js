/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  configurationTabFullyQualified,
  configurationOptionsFullyQualified,
  configurationJsStackTraceTranslationFullyQualified,
  configurationPrivacyFullyQualified,
  configurationCustomGeoDetailsFullyQualified,
  configurationTeamsFullyQualified
} from 'in-websites/navigation/paths';
import WebsiteCustomGeoDetails from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/CustomGeoDetails/WebsiteCustomGeoDetails';
import StackTraceTranslation from 'in-websites/WebsiteDashboard/tabs/Configuration/StackTraceTranslation/StackTraceTranslation';
import StickySidebarNavigationAndContent from 'in-components/layout/SideNavigationAndContent';
import WebsiteTeams from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/Teams';
import Options from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/Options';
import Privacy from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/Privacy';
import { rbacTeamsEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export default function Configuration(props) {
  const getPages = () => {
    const pages = [
      {
        label: t('in-websites:websiteDashboard.tabs.configuration.configurationLabelOptions'),
        path: configurationOptionsFullyQualified,
        component: () => <Options {...props} />
      },
      {
        label: t('in-websites:websiteDashboard.tabs.configuration.configurationLabelPrivacy'),
        path: configurationPrivacyFullyQualified,
        component: () => <Privacy {...props} />
      },
      {
        label: t('in-websites:websiteDashboard.tabs.configuration.configurationLabelCustomGeoDetails'),
        path: configurationCustomGeoDetailsFullyQualified,
        component: () => <WebsiteCustomGeoDetails {...props} />
      },
      {
        label: t('in-websites:websiteDashboard.tabs.configuration.configurationLabelJSStackTraceTranslation'),
        path: configurationJsStackTraceTranslationFullyQualified,
        component: () => <StackTraceTranslation {...props} />
      }
    ];

    if (rbacTeamsEnabled) {
      pages.push({
        label: t('in-websites:websiteDashboard.tabs.configuration.configurationLabelTeams'),
        path: configurationTeamsFullyQualified,
        component: () => <WebsiteTeams {...props} />
      });
    }

    return pages;
  };

  return (
    <StickySidebarNavigationAndContent
      navigationTree={[
        {
          title: t('in-websites:websiteDashboard.tabs.configuration.configurationTitle'),
          pages: getPages()
        }
      ]}
      redirectToDefaultPage={configurationOptionsFullyQualified}
      redirectFrom={configurationTabFullyQualified}
      {...props}
    />
  );
}
