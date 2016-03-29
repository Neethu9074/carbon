import createClusterMembersObservable from 'in-services/subscription/clusterMembers';


export function getClusterMembers(snapshotId) {
  return createClusterMembersObservable(snapshotId);
}
