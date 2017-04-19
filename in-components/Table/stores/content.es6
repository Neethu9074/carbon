import shallowEquals from 'fbjs/lib/shallowEqual';
import { create } from 'reactive-observables';
import invariant from 'invariant';

import { getMetricForFocusedMoment } from 'in-stores/metric';

export function createStore({ columnDefinitions }) {
  if (__DEV__) {
    invariant(columnDefinitions instanceof Array, 'cols must be an array');
    columnDefinitions.forEach(validateCol);
  }

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
  //       subscription: ro subscription used to retrieve the value
  //     }
  //   ]
  // }
  const data = {};

  const data$ = create().emit(data);

  return {
    data$,
    dispose,
    onRowChange
  };

  function dispose() {}

  function onRowChange(rows) {
    if (__DEV__) {
      invariant(rows instanceof Array, 'rows must be an array');
      rows.forEach(validateRow);
    }

    mark();
    for (let i = 0, length = rows.length; i < length; i++) {
      upsertRow(rows[i]);
    }
    sweep();
    emitRawDataChange();
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
        metric: columnDefinition.typeArgs.metricName
      }).subscribe(v => {
        column.value = v[1];
        row.mutationCount++;
        emitRawDataChange();
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
        column.subscription.dispose();
      }
    }
  }

  function emitRawDataChange() {
    data$.emit(data);
  }
}

function validateCol(col) {
  invariant(typeof col.title === 'string', 'col.title must be a string');
  invariant(['string', 'metric'].indexOf(col.type) !== -1, 'col.type must be string|metric');

  if (col.type === 'string') {
    invariant(
      typeof col.typeArgs.getValue === 'function',
      'Columns with type=string must have a getValue(row) function.'
    );
    invariant(
      typeof col.typeArgs.getContent === 'function',
      'Columns with type=string must have a getContent(row, value) function.'
    );
  } else if (col.type === 'metric') {
    invariant(
      typeof col.typeArgs.getSnapshotId === 'function',
      'Columns with type=metric must have a getSnapshotId(row) function.'
    );
    invariant(
      typeof col.typeArgs.metricName === 'function',
      'Columns with type=metric must have a getMetricName(row) function.'
    );
    invariant(
      typeof col.typeArgs.formatter === 'function' &&
        typeof col.typeArgs.formatter.compact === 'function' &&
        typeof col.typeArgs.formatter.detailed === 'function',
      'Columns with type=metric must have a formatter in the form of {compact, detailed}'
    );
    invariant(
      ['mean', 'count', 'adjustedCount', 'max'].indexOf(col.typeArgs.timeWindowAggregation) !== -1,
      'Columns with type=metric must have a supported timeWindowAggregation, i.e. mean|count|adjustedCount|max'
    );
  }
}

function validateRow(row) {
  invariant(typeof row.key === 'string', 'row.key must be a string');
}
