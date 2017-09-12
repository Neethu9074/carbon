import Cluster from './Cluster';

export function getTabs(snapshot, pageHash) {
  const pathPrefix = pageHash ? `/pages/${pageHash}` : '';
  return [
    {
      label: 'Cluster',
      path: `${pathPrefix}/`,
      component: Cluster
    }
  ].filter(tab => tab != null);
}
