// @flow
import React from 'react';

import { userSettings, userSettingsGeneral, userSettingsAdvanced } from 'in-views/configurationView/navigation/paths';
import AdvancedPage from 'in-views/configurationView/tabs/UserSettings/pages/Advanced';
import GeneralPage from 'in-views/configurationView/tabs/UserSettings/pages/General';
import SideNavigationAndContent from 'in-new-components/SideNavigationAndContent';
import type { NavigationTree } from 'in-new-components/SideNavigationAndContent';

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
  }
];

export default function View(props: any) {
  return (
    <SideNavigationAndContent
      navigationTree={navigationTree}
      redirectToDefaultPage={userSettingsGeneral}
      redirectFrom={userSettings}
      {...props}
    />
  );
}
