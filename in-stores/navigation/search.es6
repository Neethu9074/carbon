import {navigationParameters$, cloneDeep, toUrl} from 'in-stores/navigation/navigation';

export function getTraceViewFilteredBySnapshotLink(snapshotId) {
  const query = encodeURIComponent(`startingAt=${snapshotId}`);
  return navigationParameters$
    .map(cloneDeep)
    .map(params => {
      params.pathname = '/traces';
      params.query.q = query;
      return params;
    })
    .map(toUrl)
    .distinct();
}
