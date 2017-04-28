import { create, combineLatest } from 'reactive-observables';
import shallowEquals from 'fbjs/lib/shallowEqual';
import invariant from 'invariant';

import { renderers } from 'in-components/Table/renderers';
import { getSetting$ } from 'in-services/settings';

let updateFrequencyMillis = 3000;
getSetting$('tables_refreshRate').subscribe(refreshRate => updateFrequencyMillis = refreshRate);

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
  const data = {};

  const data$ = create().emit(data);
  const sort$ = create().emit({
    page: 0,
    column: initialSortColumn,
    direction: initialSortDirection
  });
  const rowsChanged$ = create().emit(true);
  const expandStateChange$ = create().emit(true);
  const sortedPagedData$ = combineLatest([sort$, data$.throttle(updateFrequencyMillis), rowsChanged$])
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
    rowsChanged$.emit(true);
  }

  function onSelectedRowKeyChange(selectedRowKeys) {
    for (let key in data) {
      data[key].selected = false;
      data[key].mutationCount++;
    }

    if (selectedRowKeys) {
      for (let i = 0, length = selectedRowKeys.length; i < length; i++) {
        const key = selectedRowKeys[i];
        data[key].selected = true;
        data[key].mutationCount++;
        emitRawDataChange();
      }
    }
  }

  function mark() {
    for (let rowKey in data) {
      data[rowKey].marked = true;
    }
  }

  function upsertRow(rowConfig) {
    let row = data[rowConfig.key];
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
    data[row.key] = row;

    for (let i = 0, length = columnDefinitions.length; i < length; i++) {
      row.columns[i] = initializeColumn(row, columnDefinitions[i], i);
    }
  }

  function initializeColumn(row, columnDefinition, columnIndex) {
    return renderers[columnDefinition.type].initialize(row, columnDefinition, columnIndex, emitRawDataChange);
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
      const row = data[key];
      updateContentForAllColumns(row);
      rows.push(row);
    }

    if (rows.length === 0) {
      return {
        totalRowCount: rows.length,
        rows,
        page: shownPage,
        pageCount: 1,
        sortColumnIndex,
        sortDirection
      };
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

function updateContentForAllColumns(row) {
  for (let i = 0, length = row.columns.length; i < length; i++) {
    row.columns[i].refreshContent();
  }
}

function validateCol(col) {
  invariant(typeof col.title === 'string', 'col.title must be a string');
  invariant(col.type in renderers, `Unknown col.type: ${col.type}.`);
  renderers[col.type].validate(col);
}

function buildRowComparatorForIndex(comparator, index) {
  return (rowA, rowB) => comparator(rowA.columns[index].value, rowB.columns[index].value);
}

function validateRow(row) {
  invariant(typeof row.key === 'string', 'row.key must be a string');
}
