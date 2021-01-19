/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { create, combineLatest } from '@instana/observables';
import shallowEquals from 'fbjs/lib/shallowEqual';
import invariant from 'invariant';

import { compare, isBlank, containsIgnoreCase } from 'in-services/util/string';
import { renderers } from 'in-infrastructure/tableView/components/Table/renderers';
import { getSetting$ } from 'in-services/settings';

let updateFrequencyMillis = 3000;
getSetting$('tables_refreshRate').subscribe(refreshRate => (updateFrequencyMillis = refreshRate));

export function createStore({
  columnDefinitions,
  initialSortColumn = 0,
  maxItemsPerPage = 10,
  initialSortDirection = 'asc',
  disableSorting = false
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
  //   selected: true/false
  //
  //   columns: [
  //     {
  //       columnDefinition: as passed by the user
  //       columnIndex
  //       value: number|string used for sorting the columns
  //       subscription: ro subscription used to retrieve the value
  //       comparator: function(valueA, valueB)
  //     }
  //   ]
  // }
  const data = new Map();

  const data$ = create().emit(data);
  const filter$ = create().emit('');
  const sort$ = create().emit({
    page: 0,
    column: initialSortColumn,
    direction: initialSortDirection
  });
  const rowsChanged$ = create().emit(true);
  const expandStateChange$ = create().emit(true);
  const sortedPagedData$ = combineLatest([
    sort$,
    filter$.debounce(300),
    data$.throttle(updateFrequencyMillis),
    rowsChanged$
  ])
    // Data changes synchronously when the table is created. Force this sorting to happen
    // after all columns have been created.
    .nextFrame()
    .map(toSortedPagedData);
  // expansion state changes should not result in reexecution of sorting and paging logic
  const sortedPagedDataWithRepaintSignals$ = combineLatest([sortedPagedData$, expandStateChange$]).map(
    combined => combined[0]
  );

  return {
    data$,
    sort$,
    setSort,
    sortedPagedData$: sortedPagedDataWithRepaintSignals$,
    onSelectedRowKeyChange,
    dispose,
    toggleExpanded,
    setExpansionStateForAll,
    setPage,
    onRowChange,
    filter$,
    setFilter
  };

  function setFilter(filter) {
    sort$.once(sort => {
      sort$.emit({
        page: 0,
        column: sort.column,
        direction: sort.direction
      });
    });
    filter$.emit(filter);
  }

  function dispose() {
    data.forEach((d, key) => remove(key));
  }

  function setSort(column, direction) {
    sort$.emit({
      page: 0,
      column,
      direction
    });
  }

  function setPage(page) {
    sort$.once(sort => {
      sort$.emit({
        page,
        column: sort.column,
        direction: sort.direction
      });
    });
  }

  function setExpansionStateForAll(expanded) {
    data.forEach(row => {
      row.expanded = expanded;
      row.mutationCount++;
    });
    expandStateChange$.emit(true);
  }

  function toggleExpanded(rowKey) {
    data.get(rowKey).expanded = !data.get(rowKey).expanded;
    data.get(rowKey).mutationCount++;
    expandStateChange$.emit(true);
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
    rowsChanged$.emit(true);
  }

  function onSelectedRowKeyChange(selectedRowKeys) {
    data.forEach(d => {
      d.selected = false;
      d.mutationCount++;
    });

    if (selectedRowKeys) {
      for (let i = 0, length = selectedRowKeys.length; i < length; i++) {
        const key = selectedRowKeys[i];
        const dataPoint = data.get(key);
        if (dataPoint) {
          dataPoint.selected = true;
          dataPoint.mutationCount++;
        }
      }
      emitRawDataChange();
    }
  }

  function mark() {
    data.forEach(d => (d.marked = true));
  }

  function upsertRow(rowConfig) {
    let row = data.get(rowConfig.key);
    let mutationCount = 0;
    let expanded = false;
    if (row) {
      if (shallowEquals(row.rowConfig, rowConfig)) {
        row.marked = false;
        return;
      }
      mutationCount = row.mutationCount + 1;
      expanded = row.expanded;
      remove(row.key);
      row = null;
    }

    row = {
      mutationCount,
      marked: false,
      expanded,
      key: rowConfig.key,
      rowConfig,
      columns: []
    };
    data.set(row.key, row);

    for (let i = 0, length = columnDefinitions.length; i < length; i++) {
      row.columns[i] = initializeColumn(row, columnDefinitions[i], i);
    }
  }

  function initializeColumn(row, columnDefinition, columnIndex) {
    return renderers[columnDefinition.type].initialize(row, columnDefinition, columnIndex, emitRawDataChange);
  }

  function sweep() {
    data.forEach((d, key) => {
      if (d.marked) {
        remove(key);
      }
    });
  }

  function remove(rowKey) {
    const row = data.get(rowKey);
    for (let i = 0, length = row.columns.length; i < length; i++) {
      const column = row.columns[i];
      if (column.subscription) {
        column.subscription.dispose();
      }
    }

    data.delete(rowKey);
  }

  function emitRawDataChange() {
    data$.emit(data);
  }

  function toSortedPagedData([{ column: sortColumnIndex, direction: sortDirection, page }, filter]) {
    const needsToFilter = !isBlank(filter);
    let rows = [];
    data.forEach(row => {
      if (!needsToFilter || (needsToFilter && matchesFilter(row, filter))) {
        rows.push(row);
      }
    });

    if (rows.length === 0) {
      return {
        totalRowCount: rows.length,
        rows,
        page: shownPage,
        pageCount: 1,
        sortColumnIndex,
        sortDirection,
        filter
      };
    }

    if (!disableSorting) {
      let comparator = buildRowComparatorForIndex(rows[0].columns[sortColumnIndex].comparator, sortColumnIndex);
      rows.sort(comparator);
      if (sortDirection === 'desc') {
        rows.reverse();
      }
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

    rows = rows.slice(start, end);
    rows.forEach(updateContentForAllColumns);

    return {
      totalRowCount: rows.length,
      rows,
      page: shownPage,
      pageCount,
      sortColumnIndex,
      sortDirection,
      filter
    };
  }
}

function updateContentForAllColumns(row) {
  for (let i = 0, length = row.columns.length; i < length; i++) {
    const column = row.columns[i];
    if (column.requiresContentRefresh) {
      column.requiresContentRefresh = false;
      column.refreshContent();
      row.mutationCount++;
    }
  }
}

function validateCol(col) {
  invariant(typeof col.title === 'string', 'col.title must be a string');
  invariant(col.type in renderers, `Unknown col.type: ${col.type}.`);
  renderers[col.type].validate(col);
  invariant(
    col.disableSorting === undefined || typeof col.disableSorting === 'boolean',
    'col.disableSorting must be undefined or a boolean'
  );
}

function buildRowComparatorForIndex(comparator, index) {
  return (rowA, rowB) => {
    const value = comparator(rowA.columns[index].value, rowB.columns[index].value);
    // sort by key as a second sort criteria so that sorting becomes stable
    if (value === 0) {
      return compare(rowA.key, rowB.key);
    }
    return value;
  };
}

function validateRow(row) {
  invariant(typeof row.key === 'string', 'row.key must be a string');
}

function matchesFilter(row, filter) {
  const { columns } = row;
  for (let i = 0, length = columns.length; i < length; i++) {
    const column = columns[i];
    if (typeof column.value === 'string' && containsIgnoreCase(column.value, filter)) {
      return true;
    }
    if (typeof column.content === 'string' && containsIgnoreCase(column.content, filter)) {
      return true;
    }
  }
  return false;
}
