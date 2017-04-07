import shallowEquals from 'fbjs/lib/shallowEqual';
import { create } from 'reactive-observables';

import { getMetricForFocusedMoment } from 'in-stores/metric';

export function createStore({ columnDefinitions }) {
  // row key => {
  //   mutationCount (used for change detection in react)
  //   marked (used for mark/sweep)
  //   key
  //   rowConfig
  //
  //   columns: [
  //     {
  //       columnDefinition: as passed by the user
  //       value: number|string used for sorting the columns
  //       subscription: ro subscription used to retrieve
  //     }
  //   ]
  // }
  const data = {};

  const changeSignals = create();

  return {
    dispose,
    onRowChange
  };

  function dispose() {}

  function onRowChange(rows) {
    mark();
    for (let i = 0, length = rows.length; i < length; i++) {
      upsertRow(rows[i]);
    }
    sweep();
    changeSignals.emit(true);
  }

  function mark() {
    for (let rowKey in data) {
      data[rowKey].marked = true;
    }
  }

  function upsertRow(rowConfig) {
    let row = data[rowConfig.key];
    let mutationCount = 0;
    if (row) {
      if (shallowEquals(row.rowConfig, rowConfig)) {
        row.marked = false;
        return;
      }
      mutationCount = row.mutationCount + 1;
      remove(row.key);
      row = null;
    }

    row = {
      mutationCount,
      marked: false,
      key: rowConfig.key,
      rowConfig,
      columns: []
    };
    data[row.key] = row;

    for (let i = 0, length = columnDefinitions.length; i < length; i++) {
      row.columns[i] = initializeColumn(row, columnDefinitions[i]);
    }
  }

  function initializeColumn(row, columnDefinition) {
    if (columnDefinition.type === 'string') {
      const value = columnDefinition.typeArgs.getValue(row.rowConfig);
      return {
        columnDefinition,
        value,
        subscription: null
      };
    } else if (columnDefinition.type === 'metric') {
      const column = {
        columnDefinition,
        value: null,
        subscription: null
      };

      column.subscription = getMetricForFocusedMoment({
        snapshotId: columnDefinition.typeArgs.getSnapshotId(row.rowConfig),
        metric: columnDefinition.typeArgs.getMetricName(row.rowConfig)
      }).subscribe(v => {
        column.value = v[1];
        changeSignals.emit(true);
      });

      return column;
    }

    throw new Error('Unsupported column type: ' + columnDefinition.type);
  }

  function sweep() {
    for (let rowKey in data) {
      if (data[rowKey].marked) {
        remove(rowKey);
      }
    }
  }

  function remove(rowKey) {
    const row = data[rowKey];
    delete data[rowKey];

    for (let i = 0, length = row.columns.length; i < length; i++) {
      const column = row.columns[i];
      if (column.subscription) {
        column.subscription.dipose();
      }
    }
  }
}
