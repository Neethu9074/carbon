// @flow
import React from 'react';

import {
  userSettings,
  userSettingsGeneral,
  userSettingsAdvanced,
  userSettingsPrivacy,
  userSettingsCommunication
} from 'in-settings/navigation/paths';
import SideNavigationAndContent from 'in-new-components/layout/SideNavigationAndContent';
import type { NavigationTree } from 'in-new-components/layout/SideNavigationAndContent';
import Communication from 'in-settings/tabs/UserSettings/pages/Communication';
import Privacy from 'in-settings/tabs/UserSettings/pages/Privacy';
import AdvancedPage from 'in-settings/tabs/UserSettings/pages/Advanced';
import GeneralPage from 'in-settings/tabs/UserSettings/pages/General';
import { isOnPrem } from 'in-services/featureFlags';

const navigationTree: NavigationTree = [
  {
    title: 'User Interface',
    pages: [
      {
        path: userSettingsGeneral,
        label: 'General',
        component: GeneralPage
      },
      {
        path: userSettingsAdvanced,
        label: 'Advanced',
        component: AdvancedPage
      }
    ]
  },
  {
    title: 'Preferences',
    pages: getPreferencesRoutes(isOnPrem)
  }
];

export default function View(props: any) {
  return (
    <SideNavigationAndContent
      stickySidebar
      navigationTree={navigationTree}
      redirectToDefaultPage={userSettingsGeneral}
      redirectFrom={userSettings}
      {...props}
    />
  );
}

function getPreferencesRoutes(isOnPrem) {
  const privacy = {
    path: userSettingsPrivacy,
    label: 'Privacy',
    component: Privacy
  };

  const communication = {
    path: userSettingsCommunication,
    label: 'Communication',
    component: Communication
  };

  return isOnPrem ? [communication] : [privacy, communication];
}
