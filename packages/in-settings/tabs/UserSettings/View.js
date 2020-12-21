import React, { Fragment } from 'react';

import {
  userSettings,
  userSettingsGeneral,
  userSettingsAdvanced,
  userSettingsPrivacy,
  userSettingsCommunication
} from 'in-settings/navigation/paths';
import SideNavigationAndContent from 'in-new-components/layout/SideNavigationAndContent';
import Communication from 'in-settings/tabs/UserSettings/pages/Communication';
import AdvancedPage from 'in-settings/tabs/UserSettings/pages/Advanced';
import GeneralPage from 'in-settings/tabs/UserSettings/pages/General';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import Privacy from 'in-settings/tabs/UserSettings/pages/Privacy';
import { fullTermsConfigEnabled } from 'in-services/featureFlags';
import SetBodyColor from 'in-components/SetBodyColor';

const navigationTree = [
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
    pages: getPreferencesRoutes(fullTermsConfigEnabled)
  }
];

export default function View(props) {
  return (
    <Fragment>
      <ViewTrackingMeta
        data={{
          productArea: 'Settings',
          pageRootName: 'User Settings'
        }}
      />

      <SideNavigationAndContent
        stickySidebar
        navigationTree={navigationTree}
        redirectToDefaultPage={userSettingsGeneral}
        redirectFrom={userSettings}
        {...props}
      />
      <SetBodyColor color="#fff" />
    </Fragment>
  );
}

function getPreferencesRoutes(fullTermsConfigEnabled) {
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

  return fullTermsConfigEnabled ? [privacy, communication] : [communication];
}
