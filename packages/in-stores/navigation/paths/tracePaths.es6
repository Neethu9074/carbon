import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { urlQueryKeys } from 'in-stores/time/config';

export function getTraceViewLinkWithQuery(query) {
  return getModifiedUrlStream(params => {
    params.query.q = query;
    params.query.ss = '1';
  });
}

export function getTraceViewLinkShowingTrace(traceId) {
  return getModifiedUrlStream(params => {
    params.query.traceId = traceId;
  });
}

export function getTraceViewFilteredByServiceStartingAtLink(snapshotId) {
  return getTraceViewLinkWithQuery(` trace.startingAt:"${snapshotId}"`);
}

export function getTraceViewFilteredByTouchingLink(snapshotId) {
  return getTraceViewLinkWithQuery(` trace.touching:"${snapshotId}"`);
}

export function getTraceViewFilteredByServiceEndpointStartingAtLink(snapshotId, endpointLabel) {
  return getTraceViewLinkWithQuery(` trace.touching:"${snapshotId}" span.endpoint.label:"${endpointLabel}"`);
}

export function getTraceViewFilteredByServiceInstanceStartingAtLink(snapshotId) {
  return getTraceViewLinkWithQuery(` trace.startingAtInstance:"${snapshotId}"`);
}

export function getTraceViewFilteredBySnapshotIdAndTimeframe({ snapshotId, from, to }) {
  return getModifiedUrlStream(params => {
    params.query.q = ` trace.touching:"${snapshotId}"`;
    params.query.ss = '1';
    params.query[urlQueryKeys.to] = to;
    params.query[urlQueryKeys.windowSize] = to - from;
  });
}
