import { getModifiedUrlStream } from 'in-stores/navigation/navigation';

export function getTraceViewFilteredByServiceStartingAtLink(snapshotId) {
  const query = ` trace.startingAt:"${snapshotId}"`;
  return getModifiedUrlStream(params => {
    params.pathname = '/traces';
    appendToQuery(params, query);
    params.query.ss = '1';
  });
}

export function getTraceViewFilteredByTouchingLink(snapshotId) {
  const query = ` trace.touching:"${snapshotId}"`;
  return getModifiedUrlStream(params => {
    params.pathname = '/traces';
    appendToQuery(params, query);
    params.query.ss = '1';
  });
}

export function getTraceViewFilteredByServiceInstanceStartingAtLink(snapshotId) {
  const query = ` trace.startingAtInstance:"${snapshotId}"`;
  return getModifiedUrlStream(params => {
    params.pathname = '/traces';
    appendToQuery(params, query);
    params.query.ss = '1';
  });
}

export function getTraceViewFilteredBySnapshotIdAndTimeframe({ snapshotId, from, to }) {
  const query = ` trace.touching:"${snapshotId}"`;
  return getModifiedUrlStream(params => {
    params.pathname = '/traces';
    appendToQuery(params, query);
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

function appendToQuery(params, str) {
  if (params.query.q) {
    params.query.q += str;
  } else {
    params.query.q = str;
  }
}
