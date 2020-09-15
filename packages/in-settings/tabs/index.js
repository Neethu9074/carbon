import { userSettings, teamSettings, authSettings, ampSettings } from 'in-settings/navigation/paths';
import { roleHasAnyTeamPermissions } from 'in-settings/tabs/permissions';
import UserSettings from 'in-settings/tabs/UserSettings/View';
import TeamSettings from 'in-settings/tabs/TeamSettings/View';
import AuthSettings from 'in-settings/tabs/AuthSettings/View';
import { ampEnabled } from 'in-services/featureFlags';
import AmpSettings from 'in-settings/tabs/AMP/View';
import { isOwner, role } from 'in-stores/user';

const teamTab = {
  label: 'Team Settings',
  path: teamSettings,
  component: TeamSettings
};

const userTab = {
  label: 'User Settings',
  path: userSettings,
  component: UserSettings
};

const authTab = {
  label: 'Authentication',
  path: authSettings,
  component: AuthSettings
};

const ampTab = {
  label: 'Account',
  path: ampSettings,
  component: AmpSettings
};

export default function getTabs({ isGoogleSSOAvailable, isSamlAvailable, isLdapAvailable }) {
  const authTabVisible =
    isOwner ||
    role.canConfigureSessionSettings ||
    (role.canConfigureAuthenticationMethods && (isGoogleSSOAvailable || isSamlAvailable || isLdapAvailable));

  const ampTabVisible = ampEnabled && isOwner;

  return [roleHasAnyTeamPermissions() && teamTab, userTab, authTabVisible && authTab, ampTabVisible && ampTab].filter(
    Boolean
  );
}
