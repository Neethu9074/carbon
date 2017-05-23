import { getModifiedUrlStream } from 'in-stores/navigation/navigation';

export function getTraceViewFilteredByServiceStartingAtLink(snapshotId) {
  const query = ` trace.startingAt:"${snapshotId}"`;
  return getModifiedUrlStream(params => {
    params.pathname = '/traces/search';
    params.query.q = query;
    params.query.ss = '1';
  });
}

export function getTraceViewFilteredByTouchingLink(snapshotId) {
  const query = ` trace.touching:"${snapshotId}"`;
  return getModifiedUrlStream(params => {
    params.pathname = '/traces/search';
    params.query.q = query;
    params.query.ss = '1';
  });
}

export function getTraceViewFilteredByServiceEndpointStartingAtLink(snapshotId, endpointLabel) {
  const query = ` trace.touching:"${snapshotId}" span.endpoint.label:"${endpointLabel}"`;
  return getModifiedUrlStream(params => {
    params.pathname = '/traces/search';
    params.query.q = query;
    params.query.ss = '1';
  });
}

export function getTraceViewFilteredByServiceInstanceStartingAtLink(snapshotId) {
  const query = ` trace.startingAtInstance:"${snapshotId}"`;
  return getModifiedUrlStream(params => {
    params.pathname = '/traces/search';
    params.query.q = query;
    params.query.ss = '1';
  });
}

export function getTraceViewFilteredBySnapshotIdAndTimeframe({ snapshotId, from, to }) {
  const query = ` trace.touching:"${snapshotId}"`;
  return getModifiedUrlStream(params => {
    params.pathname = '/traces/search';
    params.query.q = query;
    params.query.ss = '1';
    params.query['timeline.to'] = to;
    params.query['timeline.ws'] = to - from;
  });
}

export function getCurrentViewWithFilter(filter) {
  return getModifiedUrlStream(params => {
    params.query.q = filter;
    params.query.ss = '1';
  });
}
