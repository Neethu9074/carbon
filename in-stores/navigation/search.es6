import {navigationParameters$, cloneDeep, toUrl} from 'in-stores/navigation/navigation';

export function getTraceViewFilteredBySnapshotLink(snapshotId) {
  snapshotId = encodeURIComponent(snapshotId);
  return navigationParameters$
    .map(cloneDeep)
    .map(params => {
      params.pathname = '/traces';
      params.query.q = encodeURIComponent(`startingAt=${snapshotId}`);
      return params;
    })
    .map(toUrl)
    .distinct();
}
