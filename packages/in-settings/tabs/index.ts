/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { roleHasAnyGlobalPermissions, roleHasAnySecurityAccessPermissions } from 'in-settings/tabs/permissions';
import { userSettings, globalSettings, ampSettings, securityAndAccess } from 'in-settings/navigation/paths';
import SecurityAndAccess from 'in-settings/tabs/SecurityAndAccess/View';
// @ts-expect-error needs TS migration
import GlobalSettings from 'in-settings/tabs/GlobalSettings/View';
// @ts-expect-error needs TS migration
import UserSettings from 'in-settings/tabs/UserSettings/View';
import { ampEnabled } from 'in-services/featureFlags';
// @ts-expect-error needs TS migration
import AmpSettings from 'in-settings/tabs/AMP/View';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';
import TabView from 'in-components/LocationAwareTabView/TabView';

const globalTab = {
  label: t('in-settings:tabs.globalSettings'),
  path: globalSettings,
  component: GlobalSettings
};

const userTab = {
  label: t('in-settings:tabs.userSettings'),
  path: userSettings,
  component: UserSettings
};

const securityAndAccessTab = {
  label: t('in-settings:tabs.securityAndAccess'),
  path: securityAndAccess,
  component: SecurityAndAccess
};

const ampTab = {
  label: t('in-settings:tabs.accountBilling'),
  path: ampSettings,
  component: AmpSettings
};

type TabsArray = Parameters<typeof TabView>[0]['tabs'];

export default function getTabs(): TabsArray {
  const ampTabVisible = ampEnabled && role?.canViewAccountAndBillingInformation;

  return [
    roleHasAnyGlobalPermissions() && globalTab,
    userTab,
    roleHasAnySecurityAccessPermissions() && securityAndAccessTab,
    ampTabVisible && ampTab
  ].filter(Boolean) as TabsArray;
}
