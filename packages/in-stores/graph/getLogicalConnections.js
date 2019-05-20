import getLogicalConnectionsInternal from 'in-subscription/getLogicalConnections';
import { timeConfig$ } from 'in-stores/time/config';

export default function getLogicalConnections({ snapshotId }) {
  return timeConfig$.flatMap(timeConfig => getLogicalConnectionsInternal({ snapshotId, timeConfig }));
}
