import Notifications from './Notifications';
import Management from './Management';
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
      label: 'Logs',
      path: `/logs`,
      component: Logs
    },
    {
      label: 'Management',
      path: `/management`,
      component: Management
    },
    {
      label: 'Notifications',
      path: `/notifications`,
      component: Notifications
    }
  ];
}
