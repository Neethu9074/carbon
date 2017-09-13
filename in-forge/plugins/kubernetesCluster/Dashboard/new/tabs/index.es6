import Overview from './Overview';
import Deployments from './deployments';

export function getTabs(snapshot, pageHash) {
  const pathPrefix = pageHash ? `/pages/${pageHash}` : '';
  return [
    {
      label: 'Overview',
      path: `${pathPrefix}/`,
      component: Overview
    },
    {
      label: 'Deployments',
      path: `${pathPrefix}/deployments`,
      component: Deployments
    }
  ].filter(tab => tab != null);
}
