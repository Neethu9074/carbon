/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { userSettings, teamSettings, authSettings, ampSettings, migSettings } from 'in-settings/navigation/paths';
import { roleHasAnyTeamPermissions, hasOwnerPermission } from 'in-settings/tabs/permissions';
import { configMigrationFeatureEnabled } from 'in-services/featureFlags';
import MigrationSettings from 'in-settings/tabs/MigrationSettings/View';
import UserSettings from 'in-settings/tabs/UserSettings/View';
import TeamSettings from 'in-settings/tabs/TeamSettings/View';
import AuthSettings from 'in-settings/tabs/AuthSettings/View';
import { ampEnabled } from 'in-services/featureFlags';
import AmpSettings from 'in-settings/tabs/AMP/View';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

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

const migrationTab = {
  label: t('in-settings:tabs.migrationSettings'),
  path: migSettings,
  component: MigrationSettings
};

export default function getTabs() {
  const ampTabVisible = ampEnabled && role.canViewAccountAndBillingInformation;
  return [
    roleHasAnyTeamPermissions() && teamTab,
    userTab,
    authTab,
    ampTabVisible && ampTab,
    configMigrationFeatureEnabled && hasOwnerPermission() && migrationTab
  ].filter(Boolean);
}
