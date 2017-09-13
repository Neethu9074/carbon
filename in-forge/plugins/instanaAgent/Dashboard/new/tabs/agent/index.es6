import Notifications from './Notifications';
import Summary from './Summary';
import Logs from './Logs';

export function getTabs() {
  return [
    {
      label: 'Summary',
      path: '',
      component: Summary
    },
    {
      label: 'Management & Logs',
      path: `/logs`,
      component: Logs
    },
    {
      label: 'Notifications',
      path: `/notifications`,
      component: Notifications
    }
  ];
}
