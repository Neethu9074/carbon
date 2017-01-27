import {combineLatest} from 'reactive-observables';
import {interval} from 'reactive-observables';
import {isEqual} from 'lodash';

import {data$} from 'in-views/tableView/stores/content';
import {createStore} from 'in-stores/store';


const directionStore = createStore({
  name: 'tableView/stores/sorting/direction',
  initialValue: 'asc'
});
export const direction$ = directionStore.observable;

export function setDirection(direction) {
  directionStore.mutateTo(direction);
}

export function invertDirection() {
  directionStore.applyStateMutation(direction => direction === 'asc' ? 'desc' : 'asc');
}


const columnStore = createStore({
  name: 'tableView/stores/sorting/column',
  initialValue: null
});
export const column$ = columnStore.observable;

export function setColumn(column) {
  columnStore.mutateTo(column);
}


export const sortedSnapshotIds$ = combineLatest([data$, direction$, column$, interval(3000).startWith(0)])
  .nextFrame()
  .map(([data, direction, column]) => {
    if (column == null) {
      return Object.keys(data).sort();
    }

    const result = Object.keys(data)
      .map(key => data[key])
      .sort(buildComparator(column))
      .map(snapshotData => snapshotData.snapshotId);

    if (direction === 'desc') {
      result.reverse();
    }

    return result;
  })
  .distinct((a, b) => !isEqual(a, b));

function buildComparator(column) {
  return (a, b) => {
    if (a.columns && b.columns) {
      const aColumn = a.columns[column];
      const bColumn = b.columns[column];

      if (aColumn && bColumn) {
        if (aColumn.sortable < bColumn.sortable) {
          return -1;
        } else if (aColumn.sortable > bColumn.sortable) {
          return 1;
        }

        return 0;
      } else if (aColumn) {
        return -1;
      } else if (bColumn) {
        return 1;
      }

      return 0;
    } else if (a.columns) {
      return -1;
    } else if (b.columns) {
      return 1;
    }

    return 0;
  };
}
