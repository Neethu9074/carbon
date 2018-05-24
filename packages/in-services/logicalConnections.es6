import createLogicalConnectionsSubscription from 'in-subscription/logicalConnections';
import { timeConfig$ } from 'in-stores/time/config';

export function getLogicalConnections(snapshotId) {
  return timeConfig$.flatMap(timeConfig => createLogicalConnectionsSubscription({ snapshotId, timeConfig }));
}
