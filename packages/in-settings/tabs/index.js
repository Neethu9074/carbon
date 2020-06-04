import { userSettings, teamSettings, authSettings } from 'in-settings/navigation/paths';
import { roleHasAnyTeamPermissions } from 'in-settings/tabs/permissions';
import UserSettings from 'in-settings/tabs/UserSettings/View';
import TeamSettings from 'in-settings/tabs/TeamSettings/View';
import AuthSettings from 'in-settings/tabs/AuthSettings/View';
import { role } from 'in-stores/user';

const teamTab = {
  label: 'Team Settings',
  path: `${teamSettings}`,
  component: TeamSettings
};

const userTab = {
  label: 'User Settings',
  path: `${userSettings}`,
  component: UserSettings
};

const authTab = {
  label: 'Authentication',
  path: `${authSettings}`,
  component: AuthSettings
};

export default function getTabs({ isGoogleSSOAvailable, isSamlAvailable, isLdapAvailable, isInternalVisible }) {
  return [
    roleHasAnyTeamPermissions() && teamTab,
    userTab,
    role.canConfigureAuthenticationMethods &&
      isInternalVisible &&
      (isGoogleSSOAvailable || isSamlAvailable || isLdapAvailable) &&
      authTab
  ].filter(Boolean);
}
