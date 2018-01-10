import Applications from './Applications';
import Services from './Services';

export function getTabs() {
  return [
    {
      label: 'Applications',
      path: `/`,
      component: Applications
    },
    {
      label: 'Services',
      path: `/services`,
      component: Services
    }
  ];
}
