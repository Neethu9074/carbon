import { userSettings, teamSettings } from 'in-settings/navigation/paths';
import { roleHasAnyTeamPermissions } from 'in-settings/tabs/permissions';
import UserSettings from 'in-settings/tabs/UserSettings/View';
import TeamSettings from 'in-settings/tabs/TeamSettings/View';

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

export default (roleHasAnyTeamPermissions() ? [teamTab, userTab] : [userTab]);
