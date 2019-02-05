import { userSettings, teamSettings } from 'in-settings/navigation/paths';
import UserSettings from 'in-settings/tabs/UserSettings/View';
import TeamSettings from 'in-settings/tabs/TeamSettings/View';

export default [
  {
    label: 'Team Settings',
    path: `${teamSettings}`,
    component: TeamSettings
  },
  {
    label: 'User Settings',
    path: `${userSettings}`,
    component: UserSettings
  }
];
