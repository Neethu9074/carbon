import {create} from 'reactive-observables';

import {physicalViewStructure$} from 'in-stores/view';
import {getTableDefinition} from 'in-sdk/snapshot';
import {getSnapshot} from 'in-stores/snapshot';

let snapshotsSubscription;

// snapshotId => {
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

const hasChanges = create();


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
  const snapshotData = data[snapshotId];
  if (snapshotData) {
    snapshotData.marked = false;
    return;
  }

  snapshotData = data[snapshotId] = {
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
    snapshotData.contentSubscription = result.subscribe(columnContentDefinition => {
        columnData.content = columnContentDefinition.content;
        columnData.sortable = columnContentDefinition.sortable;
      });
    return;
  }

  if (result.content != null) {
    columnData.content = result.content;
  } else if (result.content$ != null) {
    snapshotData.contentSubscription = result.content$.subscribe(columnContentDefinition => {
        columnData.content = columnContentDefinition.content;
      });
  }

  if (result.sortable != null) {
    columnData.sortable = result.sortable;
  } else if (result.sortable$ != null) {
    snapshotData.sortableSubscription = result.sortable$.subscribe(columnContentDefinition => {
        columnData.sortable = columnContentDefinition.sortable;
      });
  }
}


function notifyAboutDataChanges() {
  hasChanges.emit(true);
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
