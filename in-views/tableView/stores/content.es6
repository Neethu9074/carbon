import {create} from 'reactive-observables';
import {isEqual} from 'lodash';

import {physicalViewStructure$} from 'in-stores/view';
import {getTableDefinition} from 'in-sdk/snapshot';
import {getSnapshot} from 'in-stores/snapshot';

let snapshotsSubscription;

// snapshotId => {
//   mutationCount (used for change detection in react)
//   marked (used for mark/sweep)
//   snapshotId
//   snapshot
//   snapshotSubscription
//
//   columns: [
//     {
//       content
//       sortable
//       contentSubscription
//       sortableSubscription
//     }
//   ]
// }
const data = {};
export const data$ = create({
  start: enable,
  stop: disable
});


// potentially add sorting here
export const snapshotIds$ = data$
  .map(d => Object.keys(d).sort())
  .distinct((a, b) => !isEqual(a, b));


export function enable() {
  snapshotsSubscription = getAllSnapshotIds()
    .subscribe(onSnapshotIdsUpdate);
}


function getAllSnapshotIds() {
  return physicalViewStructure$
    .map(viewStructure => {
      const hosts = [];

      viewStructure.get('children')
        .forEach(zone => {
          zone.get('children')
            .forEach(host => {
              const id = host.get('id');
              if (id.indexOf('unmon-host=') !== 0) {
                hosts.push(host.get('id'));
              }
            });
        });

      return hosts;
    });
}


function onSnapshotIdsUpdate(snapshotIds) {
  mark();
  snapshotIds.forEach(addSnapshotId);
  sweep();
  notifyAboutDataChanges();
}


function mark() {
  Object.keys(data).forEach(snapshotId => data[snapshotId].marked = true);
}


function sweep() {
  Object.keys(data).forEach(snapshotId => {
    if (data[snapshotId].marked) {
      removeSnapshotId(snapshotId);
    }
  });
}


export function disable() {
  if (snapshotsSubscription) {
    snapshotsSubscription.dispose();
    snapshotsSubscription = null;
  }
  Object.keys(data).forEach(removeSnapshotId);
}


function addSnapshotId(snapshotId) {
  let snapshotData = data[snapshotId];
  if (snapshotData) {
    snapshotData.marked = false;
    return;
  }

  snapshotData = data[snapshotId] = {
    mutationCount: 0,
    marked: false,
    columns: []
  };

  snapshotData.snapshotSubscription = getSnapshot(snapshotId)
    .subscribe(snapshot => {
      snapshotData.id = snapshotId;
      snapshotData.snapshot = snapshot;
      const tableDefinition = getTableDefinition(snapshot.get('plugin'));
      disposeColumnSubscriptions(snapshotData);

      tableDefinition.forEach((columnDefinition, i) => {
        establishColumnSubscription(snapshotData, columnDefinition, i);
      });

      notifyAboutDataChanges(snapshotData);
    });
}


function establishColumnSubscription(snapshotData, columnDefinition, i) {
  const defaultSortable = columnDefinition.sortableType === Number ? -1 : 0;
  const columnData = snapshotData.columns[i] = {
    content: '',
    sortable: defaultSortable,
    contentSubscription: null,
    sortableSubscription: null
  };

  const result = columnDefinition.get(snapshotData.snapshot);
  if (result == null) {
    return;
  }

  const type = typeof result;
  if (type === 'string' || type === 'number') {
    columnData.content = result;
    columnData.sortable = result;
    return;
  }

  if (typeof result.subscribe === 'function') {
    snapshotData.contentSubscription = result
      .subscribe(columnContentDefinition => {
        columnData.sortable = columnContentDefinition.sortable;

        if (columnData.content !== columnContentDefinition.content) {
          columnData.content = columnContentDefinition.content;
          notifyAboutDataChanges(snapshotData);
        }
      });
    return;
  }

  if (result.content != null) {
    columnData.content = result.content;
  } else if (result.content$ != null) {
    snapshotData.contentSubscription = result.content$
      .distinct()
      .subscribe(columnContentDefinition => {
        columnData.content = columnContentDefinition.content;
        notifyAboutDataChanges(snapshotData);
      });
  }

  if (result.sortable != null) {
    columnData.sortable = result.sortable;
  } else if (result.sortable$ != null) {
    snapshotData.sortableSubscription = result.sortable$
      .distinct()
      .subscribe(columnContentDefinition => {
        columnData.sortable = columnContentDefinition.sortable;
      });
  }
}


function notifyAboutDataChanges(snapshotData) {
  if (snapshotData) {
    snapshotData.mutationCount++;
  }
  data$.emit(data);
}


function removeSnapshotId(snapshotId) {
  const snapshotData = data[snapshotId];
  delete data[snapshotId];

  if (snapshotData.snapshotSubscription) {
    snapshotData.snapshotSubscription.dispose();
    snapshotData.snapshotSubscription = null;
  }

  disposeColumnSubscriptions(snapshotData);
}


function disposeColumnSubscriptions(snapshotData) {
  snapshotData.columns.forEach(column => {
    if (column.contentSubscription) {
      column.contentSubscription.dispose();
      column.contentSubscription = null;
    }

    if (column.sortableSubscription) {
      column.sortableSubscription.dispose();
      column.sortableSubscription = null;
    }
  });
}


export function getRowDataForSnapshotId(snapshotId) {
  let lastMutationCount;
  return data$
    .map(d => d[snapshotId])
    .filter(d => d != null)
    // simulating a distinct based on value operator
    .distinct(d => d.mutationCount !== lastMutationCount)
    .tap(d => lastMutationCount = d.mutationCount);
}
