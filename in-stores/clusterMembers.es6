import createClusterMembersObservable from 'in-services/subscription/clusterMembers';
import {timeframe$} from 'in-stores/timeline';

export function getClusterMembers(snapshotId) {
  return timeframe$.flatMap(timeframe => createClusterMembersObservable(snapshotId, timeframe.to));
}
