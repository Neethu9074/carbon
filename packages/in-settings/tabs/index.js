import { userSettings, teamSettings, googleSSO, saml, ldap, twoFaUsers } from 'in-settings/navigation/paths';
import { roleHasAnyTeamPermissions } from 'in-settings/tabs/permissions';
import UserSettings from 'in-settings/tabs/UserSettings/View';
import TeamSettings from 'in-settings/tabs/TeamSettings/View';
import AuthSettings from 'in-settings/tabs/AuthSettings/View';
import { isOwner, role } from 'in-stores/user';

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

export default function getTabs({ isGoogleSSOAvailable, isSamlAvailable, isLdapAvailable, isInternalVisible }) {
  const authTabVisible =
    isOwner ||
    isInternalVisible ||
    (role.canConfigureAuthenticationMethods && (isGoogleSSOAvailable || isSamlAvailable || isLdapAvailable));

  return [
    roleHasAnyTeamPermissions() && teamTab,
    userTab,
    authTabVisible && getAuthTag(isInternalVisible, isGoogleSSOAvailable, isSamlAvailable, isLdapAvailable)
  ].filter(Boolean);
}

function getAuthTag(isInternalVisible, isGoogleSSOAvailable, isSamlAvailable, isLdapAvailable) {
  let path = twoFaUsers;
  if (isInternalVisible && isGoogleSSOAvailable) {
    path = googleSSO;
  } else if (isInternalVisible && isSamlAvailable) {
    path = saml;
  } else if (isInternalVisible && isLdapAvailable) {
    path = ldap;
  }
  return {
    label: 'Authentication',
    path: path,
    component: AuthSettings
  };
}
