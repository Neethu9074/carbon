import Overview from './Overview';
import Deployments from './deployments';

export function getTabs() {
  return [
    {
      label: 'Overview',
      path: `/`,
      component: Overview
    },
    {
      label: 'Deployments',
      path: `/deployments`,
      component: Deployments
    }
  ].filter(tab => tab != null);
}
