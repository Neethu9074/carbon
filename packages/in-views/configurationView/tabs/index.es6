import { userSettings, teamSettings } from 'in-views/configurationView/navigation/paths';
import UserSettings from 'in-views/configurationView/tabs/UserSettings/View';
import TeamSettings from 'in-views/configurationView/tabs/TeamSettings/View';

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
