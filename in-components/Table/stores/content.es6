import shallowEquals from 'fbjs/lib/shallowEqual';
import { create, combineLatest } from 'reactive-observables';
import invariant from 'invariant';

import { compareIgnoreCase as compareString } from 'in-services/util/string';
import { compare as compareNumber } from 'in-services/util/number';
import { getMetricForFocusedMoment } from 'in-stores/metric';
import { getIn } from 'in-services/settings';

let updateFrequencyMillis = 3000;
getIn(['tables', 'refreshRate']).subscribe(refreshRate => updateFrequencyMillis = refreshRate);

export function createStore({
  columnDefinitions,
  initialSortColumn = 0,
  maxItemsPerPage = 10,
  initialSortDirection = 'asc'
}) {
  if (__DEV__) {
    invariant(typeof initialSortColumn === 'number', 'initialSortColumn must be a number');
    invariant(typeof maxItemsPerPage === 'number', 'maxItemsPerPage must be a number');
    invariant(maxItemsPerPage > 0, 'maxItemsPerPage must be a positive number');
    invariant(columnDefinitions instanceof Array, 'cols must be an array');
    invariant(columnDefinitions.length > 0, 'There must be at least one column');
    invariant(
      initialSortColumn < columnDefinitions.length,
      'initialSortColumn must be smaller than the number of columns'
    );
    columnDefinitions.forEach(validateCol);
  }

  // row key => {
  //   mutationCount (used for change detection in react)
  //   marked (used for mark/sweep)
  //   key
  //   rowConfig
  //   expanded: true/false
  //
  //   columns: [
  //     {
  //       columnDefinition: as passed by the user
  //       columnIndex
  //       value: number|string used for sorting the columns
  //       content: string|react element
  //       subscription: ro subscription used to retrieve the value
  //       comparator: function(valueA, valueB)
  //     }
  //   ]
  // }
  const data = {};

  const data$ = create().emit(data);
  const sort$ = create().emit({
    page: 0,
    column: initialSortColumn,
    direction: initialSortDirection
  });
  const expandStateChange$ = create().emit(true);
  const sortedPagedData$ = combineLatest([sort$, data$.throttle(updateFrequencyMillis)]).map(toSortedPagedData);
  // expansion state changes should not result in reexecution of sorting and paging logic
  const sortedPagedDataWithRepaintSignals$ = combineLatest([sortedPagedData$, expandStateChange$]).map(
    combined => combined[0]
  );

  return {
    data$,
    sort$,
    setSort,
    sortedPagedData$: sortedPagedDataWithRepaintSignals$,
    dispose,
    toggleExpanded,
    onPrevPage,
    onNextPage,
    onRowChange
  };

  function dispose() {
    Object.keys(data).forEach(remove);
  }

  function setSort(column, direction) {
    sort$.emit({
      page: 0,
      column,
      direction
    });
  }

  function onPrevPage() {
    sort$.once(sort => {
      sort$.emit({
        page: Math.max(sort.page - 1),
        column: sort.column,
        direction: sort.direction
      });
    });
  }

  function toggleExpanded(rowKey) {
    data[rowKey].expanded = !data[rowKey].expanded;
    data[rowKey].mutationCount++;
    expandStateChange$.emit(true);
  }

  function onNextPage() {
    sort$.once(sort => {
      sort$.emit({
        page: Math.max(sort.page + 1),
        column: sort.column,
        direction: sort.direction
      });
    });
  }

  function onRowChange(rows) {
    if (__DEV__) {
      invariant(rows instanceof Array, 'rows must be an array');
      rows.forEach(validateRow);
    }

    const length = rows.length;
    mark();
    for (let i = 0; i < length; i++) {
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
      expanded: false,
      key: rowConfig.key,
      rowConfig,
      columns: []
    };
    data[row.key] = row;

    for (let i = 0, length = columnDefinitions.length; i < length; i++) {
      row.columns[i] = initializeColumn(row, columnDefinitions[i], i);
    }
  }

  function initializeColumn(row, columnDefinition, columnIndex) {
    if (columnDefinition.type === 'string') {
      const value = columnDefinition.typeArgs.getValue(row.rowConfig);
      const content = columnDefinition.typeArgs.getContent(value, row.rowConfig);
      return {
        columnDefinition,
        columnIndex,
        value,
        content,
        subscription: null,
        comparator: compareString
      };
    } else if (columnDefinition.type === 'number') {
      const value = columnDefinition.typeArgs.getValue(row.rowConfig);
      const content = columnDefinition.typeArgs.getContent(value, row.rowConfig);
      return {
        columnDefinition,
        columnIndex,
        value,
        content,
        subscription: null,
        comparator: compareNumber
      };
    } else if (columnDefinition.type === 'metric') {
      const column = {
        columnDefinition,
        columnIndex,
        value: null,
        content: null,
        subscription: null,
        comparator: compareNumber
      };

      const getContent = columnDefinition.typeArgs.getContent;

      column.subscription = getMetricForFocusedMoment({
        snapshotId: columnDefinition.typeArgs.getSnapshotId(row.rowConfig),
        metric: columnDefinition.typeArgs.getMetricName(row.rowConfig)
      }).subscribe(v => {
        column.value = v[1];
        column.content = getContent(v[1], row.rowConfig);
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

  function toSortedPagedData([{ column: sortColumnIndex, direction: sortDirection, page }]) {
    const rows = [];
    for (let key in data) {
      rows.push(data[key]);
    }

    let comparator = buildRowComparatorForIndex(rows[0].columns[sortColumnIndex].comparator, sortColumnIndex);
    rows.sort(comparator);
    if (sortDirection === 'desc') {
      rows.reverse();
    }

    let start;
    let end;
    let pageCount = Math.ceil(rows.length / maxItemsPerPage);
    let shownPage;
    if (page * maxItemsPerPage > rows.length) {
      start = Math.max(0, rows.length - maxItemsPerPage);
      end = start + maxItemsPerPage;
      shownPage = Math.max(1, pageCount - 1);
    } else {
      start = page * maxItemsPerPage;
      end = (page + 1) * maxItemsPerPage;
      shownPage = page;
    }

    return {
      totalRowCount: rows.length,
      rows: rows.slice(start, end),
      page: shownPage,
      pageCount,
      sortColumnIndex,
      sortDirection
    };
  }
}

function validateCol(col) {
  invariant(typeof col.title === 'string', 'col.title must be a string');
  invariant(['string', 'number', 'metric'].indexOf(col.type) !== -1, 'col.type must be string|number|metric');

  if (col.type === 'string') {
    invariant(
      typeof col.typeArgs.getValue === 'function',
      'Columns with type=string must have a getValue(row) function.'
    );
    invariant(
      typeof col.typeArgs.getContent === 'function',
      'Columns with type=string must have a getContent(value, row) function.'
    );
  } else if (col.type === 'number') {
    invariant(
      typeof col.typeArgs.getValue === 'function',
      'Columns with type=number must have a getValue(row) function.'
    );
    invariant(
      typeof col.typeArgs.getContent === 'function',
      'Columns with type=number must have a getContent(value, row) function.'
    );
  } else if (col.type === 'metric') {
    invariant(
      typeof col.typeArgs.getSnapshotId === 'function',
      'Columns with type=metric must have a getSnapshotId(row) function.'
    );
    invariant(
      typeof col.typeArgs.getMetricName === 'function',
      'Columns with type=metric must have a getMetricName(row) function.'
    );
    invariant(
      typeof col.typeArgs.getContent === 'function',
      'Columns with type=metric must have a getContent(value, row) function'
    );
    invariant(
      ['mean', 'count', 'adjustedCount', 'max'].indexOf(col.typeArgs.timeWindowAggregation) !== -1,
      'Columns with type=metric must have a supported timeWindowAggregation, i.e. mean|count|adjustedCount|max'
    );
  }
}

function buildRowComparatorForIndex(comparator, index) {
  return (rowA, rowB) => comparator(rowA.columns[index].value, rowB.columns[index].value);
}

function validateRow(row) {
  invariant(typeof row.key === 'string', 'row.key must be a string');
}
