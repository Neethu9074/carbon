/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment, useEffect, useState } from 'react';

import {
  userSettings,
  userSettingsGeneral,
  userSettingsAdvanced,
  userSettingsPrivacy,
  userSettingsCommunication,
  userSettingsPersonalApiTokens,
  userSettingsPasswordChange,
  userSettingsTwoFactor,
  userSettingsProfile
} from 'in-settings/navigation/paths';
import StickySidebarNavigationAndContent from 'in-components/layout/SideNavigationAndContent/StickySidebarNavigationAndContent';
import { isAvailableCached as fetchChangePasswordAvailable } from 'in-settings/tabs/UserSettings/api/changePassword';
import TwoFactorSettingsPage from 'in-settings/tabs/UserSettings/pages/TwoFactorSettings';
import PersonalApiTokensPage from 'in-settings/tabs/UserSettings/pages/PersonalApiTokens';
import ChangePasswordPage from 'in-settings/tabs/UserSettings/pages/ChangePassword';
import Communication from 'in-settings/tabs/UserSettings/pages/Communication';
import AdvancedPage from 'in-settings/tabs/UserSettings/pages/Advanced';
import ProfilePage from 'in-settings/tabs/UserSettings/pages/Profile';
import GeneralPage from 'in-settings/tabs/UserSettings/pages/General';
import Privacy from 'in-settings/tabs/UserSettings/pages/Privacy';
import { fullTermsConfigEnabled } from 'in-services/featureFlags';
import { productAreas } from 'in-services/tracking/productAreas';
import { tealiumPrivacyEnabled } from 'in-services/featureFlags';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

const navigationTree = showPassword => {
  const password = showPassword
    ? [
        {
          path: userSettingsPasswordChange,
          label: t('in-settings:tabs.password'),
          component: ChangePasswordPage
        },
        {
          path: userSettingsTwoFactor,
          label: t('in-settings:tabs.twoFactorAuthentication'),
          component: TwoFactorSettingsPage
        }
      ]
    : [];
  const personalApiTokens = role.canConfigurePersonalApiTokens
    ? [
        {
          path: userSettingsPersonalApiTokens,
          label: t('in-settings:tabs.personalApiTokens'),
          component: PersonalApiTokensPage
        }
      ]
    : [];
  const preferences = tealiumPrivacyEnabled
    ? []
    : [
        {
          title: t('in-settings:tabs.preferences'),
          pages: getPreferencesRoutes(fullTermsConfigEnabled)
        }
      ];
  return [
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
    ...preferences,
    {
      title: t('in-settings:tabs.personalSettings'),
      pages: [
        {
          path: userSettingsProfile,
          label: t('in-settings:tabs.profile.pageName'),
          component: ProfilePage
        },
        ...password,
        ...personalApiTokens
      ]
    }
  ].filter(Boolean);
};

export default function View(props) {
  const [changePasswordAvailable, setChangePasswordAvailable] = useState(false);
  useEffect(() => {
    fetchChangePasswordAvailable().once(state => setChangePasswordAvailable(state));
  }, []);
  return (
    <Fragment>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.settings,
          pageRootName: pageNames.user_settings
        }}
      />

      <StickySidebarNavigationAndContent
        navigationTree={navigationTree(changePasswordAvailable)}
        redirectToDefaultPage={userSettingsGeneral}
        redirectFrom={userSettings}
        {...props}
      />
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
