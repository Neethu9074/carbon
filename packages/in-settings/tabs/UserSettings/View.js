/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import {
  userSettings,
  userSettingsGeneral,
  userSettingsAdvanced,
  userSettingsPrivacy,
  userSettingsProfile,
  userSettingsCommunication
} from 'in-settings/navigation/paths';
import SideNavigationAndContent from 'in-new-components/layout/SideNavigationAndContent';
import Communication from 'in-settings/tabs/UserSettings/pages/Communication';
import AdvancedPage from 'in-settings/tabs/UserSettings/pages/Advanced';
import GeneralPage from 'in-settings/tabs/UserSettings/pages/General';
import ProfilePage from 'in-settings/tabs/UserSettings/pages/Profile';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import Privacy from 'in-settings/tabs/UserSettings/pages/Privacy';
import { fullTermsConfigEnabled } from 'in-services/featureFlags';
import SetBodyColor from 'in-components/SetBodyColor';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

const general = {
  title: t('in-settings:tabs.general'),
  pages: [
    {
      path: userSettingsProfile,
      label: t('in-settings:tabs.profile'),
      component: ProfilePage
    }
  ]
};

const userInterface = {
  title: t('in-settings:tabs.userInterface'),
  pages: [
    {
      path: userSettingsGeneral,
      label: t('in-settings:tabs.general'),
      component: GeneralPage
    },
    {
      path: userSettingsAdvanced,
      label: t('in-settings:tabs.advanced'),
      component: AdvancedPage
    }
  ]
};

const preferences = {
  title: t('in-settings:tabs.preferences'),
  pages: getPreferencesRoutes(fullTermsConfigEnabled)
};

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
        navigationTree={role.canConfigureUsers ? [general, userInterface, preferences] : [userInterface, preferences]}
        redirectToDefaultPage={role.canConfigureUsers ? userSettingsProfile : userSettingsGeneral}
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
    label: t('in-settings:tabs.privacy'),
    component: Privacy
  };

  const communication = {
    path: userSettingsCommunication,
    label: t('in-settings:tabs.communication'),
    component: Communication
  };

  return fullTermsConfigEnabled ? [privacy, communication] : [communication];
}
