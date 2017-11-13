import { createStore } from 'in-stores/store';

const snapshotType = createStore({
  name: 'tableView/stores/snapshotType',
  initialValue: null
});
export const snapshotType$ = snapshotType.observable;

export function setSnapshotType(type) {
  snapshotType.mutateTo(type);
}
