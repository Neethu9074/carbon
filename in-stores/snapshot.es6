import createSnapshotObservable from 'in-services/subscription/snapshot';

export function getSnapshot(snapshotId) {
  return createSnapshotObservable({snapshotId});
}
