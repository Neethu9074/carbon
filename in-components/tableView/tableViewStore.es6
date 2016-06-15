import {mutateUrl, navigationParameters$} from 'in-stores/navigation';
import {emptySet} from 'in-services/fixedImmutables';
import {createTrackingStore, createStore} from 'in-stores/store';
import {view$, types} from 'in-stores/view';

export const isTableVisible$ = createTrackingStore({
  name: 'tableView/isOpen',
  observable: navigationParameters$
    .map(params => 'tableView' in params.query)
    .distinct()
}).observable;


export function toggleTableViewVisibility() {
  mutateUrl(params => {
    if ('tableView' in params.query) {
      delete params.query;
    } else {
      params.query.tableView = 'true';
    }
    return params;
  });
}


export function closeTableView() {
  mutateUrl(params => {
    delete params.query.tableView;
    return params;
  });
}


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

export function init() {
  view$.subscribe(view => {
    if (view !== types.physical) {
      closeTableView();
    }
  });
}
