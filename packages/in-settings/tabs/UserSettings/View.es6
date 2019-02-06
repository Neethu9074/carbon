// @flow
import React from 'react';

import { userSettings, userSettingsGeneral, userSettingsAdvanced } from 'in-settings/navigation/paths';
import SideNavigationAndContent from 'in-new-components/layout/SideNavigationAndContent';
import type { NavigationTree } from 'in-new-components/layout/SideNavigationAndContent';
import AdvancedPage from 'in-settings/tabs/UserSettings/pages/Advanced';
import GeneralPage from 'in-settings/tabs/UserSettings/pages/General';

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
