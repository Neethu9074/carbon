import {emptySet} from 'in-services/fixedImmutables';
import {createStore} from 'in-stores/store';

const expandedSnapshotIdsStore = createStore({
  name: 'tableView/expandedSnapshotIds',
  initialValue: emptySet
});

export const expandedSnapshotIds$ = expandedSnapshotIdsStore.observable;

export function addExpandedSnapshotIds(snapshotIds) {
  expandedSnapshotIdsStore.applyStateMutation(prev => prev.union(snapshotIds));
}

export function removeExpandedSnapshotIds(snapshotIds) {
  expandedSnapshotIdsStore.applyStateMutation(prev => prev.subtract(snapshotIds));
}

export function toggledExpandedSnapshotId(snapshotId) {
  expandedSnapshotIdsStore.applyStateMutation(prev => {
    if (prev.contains(snapshotId)) {
      return prev.delete(snapshotId);
    }
    return prev.add(snapshotId);
  });
}
