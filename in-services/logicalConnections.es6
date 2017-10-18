import createLogicalConnectionsSubscription from 'in-services/subscription/logicalConnections';
import { focusedMoment$ } from 'in-stores/timeline';

export function getLogicalConnections(snapshotId) {
  return focusedMoment$.flatMap(time => createLogicalConnectionsSubscription({ snapshotId, time }));
}
