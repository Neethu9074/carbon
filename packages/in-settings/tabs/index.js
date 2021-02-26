/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { userSettings, teamSettings, authSettings, ampSettings } from 'in-settings/navigation/paths';
import { roleHasAnyTeamPermissions } from 'in-settings/tabs/permissions';
import UserSettings from 'in-settings/tabs/UserSettings/View';
import TeamSettings from 'in-settings/tabs/TeamSettings/View';
import AuthSettings from 'in-settings/tabs/AuthSettings/View';
import AmpSettings from 'in-settings/tabs/AMP/View';
import { role } from 'in-stores/user';

const teamTab = {
  label: t('in-settings:tabs.teamSettings'),
  path: teamSettings,
  component: TeamSettings
};

const userTab = {
  label: t('in-settings:tabs.userSettings'),
  path: userSettings,
  component: UserSettings
};

const authTab = {
  label: t('in-settings:tabs.authentication'),
  path: authSettings,
  component: AuthSettings
};

const ampTab = {
  label: t('in-settings:tabs.accountBilling'),
  path: ampSettings,
  component: AmpSettings
};

export default function getTabs() {
  const ampTabVisible = role.canViewAccountAndBillingInformation;
  return [roleHasAnyTeamPermissions() && teamTab, userTab, authTab, ampTabVisible && ampTab].filter(Boolean);
}
