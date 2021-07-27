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
  userSettingsCommunication,
  userSettingsPersonalApiTokens,
  userSettingsPersonalApiTokenEdit
} from 'in-settings/navigation/paths';
import PersonalApiTokensPage from 'in-settings/tabs/UserSettings/pages/PersonalApiTokens/PersonalApiTokens';
import PersonalApiTokenPage from 'in-settings/tabs/UserSettings/pages/PersonalApiTokens/PersonalApiToken';
import SideNavigationAndContent from 'in-components/layout/SideNavigationAndContent';
import Communication from 'in-settings/tabs/UserSettings/pages/Communication';
import AdvancedPage from 'in-settings/tabs/UserSettings/pages/Advanced';
import GeneralPage from 'in-settings/tabs/UserSettings/pages/General';
import Privacy from 'in-settings/tabs/UserSettings/pages/Privacy';
import { fullTermsConfigEnabled } from 'in-services/featureFlags';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import SetBodyColor from 'in-components/SetBodyColor';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

const navigationTree = [
  {
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
  },
  {
    title: t('in-settings:tabs.preferences'),
    pages: getPreferencesRoutes(fullTermsConfigEnabled)
  },
  role.canConfigurePersonalApiTokens && {
    title: t('in-settings:tabs.personalSettings'),
    pages: [
      {
        path: userSettingsPersonalApiTokens,
        label: t('in-settings:tabs.personalApiTokens'),
        component: PersonalApiTokensPage,
        subPages: [
          {
            path: userSettingsPersonalApiTokenEdit,
            component: PersonalApiTokenPage
          }
        ]
      }
    ]
  }
].filter(Boolean);

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
