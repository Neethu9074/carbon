import createClusterMembersObservable from 'in-services/subscription/clusterMembers';
import {focusedMoment$} from 'in-stores/timeline';


export function getClusterMembers(snapshotId) {
  return focusedMoment$.flatMap(focusedMoment => createClusterMembersObservable({
    snapshotId, time: focusedMoment
  }));
}
