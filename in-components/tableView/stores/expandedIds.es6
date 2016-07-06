import {combineLatest} from 'reactive-observables';
import Immutable from 'immutable';

import {isFilterActive$, snapshotIdsInPhysicalView$} from 'in-components/tableView/stores/search';
import {emptySet} from 'in-services/fixedImmutables';
import {searchMatches$} from 'in-stores/search';
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

export function toggleExpandedSnapshotId(snapshotId) {
  expandedSnapshotIdsStore.applyStateMutation(prev => {
    if (prev.contains(snapshotId)) {
      return prev.delete(snapshotId);
    }
    return prev.add(snapshotId);
  });
}

export function collapseAll() {
  expandedSnapshotIdsStore.applyStateMutation(() => emptySet);
}

export function expandAll() {
  snapshotIdsInPhysicalView$.once(snapshotIds => {
    expandedSnapshotIdsStore.applyStateMutation(() => Immutable.Set(snapshotIds));
  });
}

export function init() {
  combineLatest([isFilterActive$, searchMatches$])
    .map(([isFilterActive, searchMatches]) => isFilterActive || searchMatches)
    .distinct()
    .subscribe(active => {
      if (active) {
        expandAll();
      } else {
        collapseAll();
      }
    });
}
