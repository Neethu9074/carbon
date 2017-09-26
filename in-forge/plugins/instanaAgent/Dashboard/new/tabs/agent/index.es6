import { agentNotificationsEnabled } from 'in-services/featureFlags';

import Notifications from './Notifications';
import Summary from './Summary';
import Logs from './Logs';

export function getTabs() {
  const tabs = [
    {
      label: 'Summary',
      path: '',
      component: Summary
    },
    {
      label: 'Management',
      path: `/logs`,
      component: Logs
    }
  ];

  if (agentNotificationsEnabled) {
    tabs.push({
      label: 'Notifications',
      path: `/notifications`,
      component: Notifications
    });
  }

  return tabs;
}
