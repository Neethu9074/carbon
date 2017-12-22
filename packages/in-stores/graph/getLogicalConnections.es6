import getLogicalConnectionsInternal from 'in-subscription/getLogicalConnections';
import { focusedMoment$ } from 'in-stores/timeline';

export default function getLogicalConnections({ snapshotId }) {
  return focusedMoment$.flatMap(focusedMoment => getLogicalConnectionsInternal({ snapshotId, focusedMoment }));
}
