import {navigationParameters$, cloneDeep, toUrl} from 'in-stores/navigation/navigation';


export function getTraceViewFilteredByServiceStartingAtLink(snapshotId) {
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


export function getTraceViewFilteredByTouchingLink(snapshotId) {
  const query = encodeURIComponent(`touching=${snapshotId}`);
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


export function getTraceViewFilteredByServiceInstanceStartingAtLink(snapshotId) {
  const query = encodeURIComponent(`startingAtInstance=${snapshotId}`);
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


export function getTraceViewFilteredBySnapshotIdAndTimeframe({snapshotId, from, to}) {
  const query = encodeURIComponent(`touching=${snapshotId}`);
  return navigationParameters$
    .map(cloneDeep)
    .map(params => {
      params.pathname = '/traces';
      params.query.q = query;
      params.query['timeline.to'] = to;
      params.query['timeline.ws'] = to - from;
      return params;
    })
    .map(toUrl)
    .distinct();
}
