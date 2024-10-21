/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { userSettings, globalSettings, ampSettings, securityAndAccessSettings } from 'in-settings/navigation/paths';
import { roleHasAnyGlobalPermissions, roleHasAnySecurityAccessPermissions } from 'in-settings/tabs/permissions';
import SecurityAndAccessSettings from 'in-settings/tabs/SecurityAndAccessSettings/View';
import UserSettings from 'in-settings/tabs/UserSettings/View';
import TeamSettings from 'in-settings/tabs/TeamSettings/View';
import { ampEnabled } from 'in-services/featureFlags';
import AmpSettings from 'in-settings/tabs/AMP/View';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

const globalTab = {
  label: t('in-settings:tabs.globalSettings'),
  path: globalSettings,
  component: TeamSettings
};

const userTab = {
  label: t('in-settings:tabs.userSettings'),
  path: userSettings,
  component: UserSettings
};

const securityAndAccessTab = {
  label: t('in-settings:tabs.securityAndAccess'),
  path: securityAndAccessSettings,
  component: SecurityAndAccessSettings
};

const ampTab = {
  label: t('in-settings:tabs.accountBilling'),
  path: ampSettings,
  component: AmpSettings
};

export default function getTabs() {
  const ampTabVisible = ampEnabled && role.canViewAccountAndBillingInformation;

  return [
    roleHasAnyGlobalPermissions() && globalTab,
    userTab,
    roleHasAnySecurityAccessPermissions() && securityAndAccessTab,
    ampTabVisible && ampTab
  ].filter(Boolean);
}
