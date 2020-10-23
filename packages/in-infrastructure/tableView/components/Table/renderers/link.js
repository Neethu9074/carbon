import invariant from 'invariant';
import React from 'react';

import { cellLoadingIndicatorInstance } from 'in-infrastructure/tableView/components/Table/components/CellLoadingIndicator';
import { noop } from 'in-services/fixedObjects';
import Link from 'in-components/Link';

export const type = 'link';

export function validate(col) {
  invariant(
    typeof col.typeArgs.get === 'function' || typeof col.typeArgs.get$ === 'function',
    'Columns with type=link must have a get(row) function which returns objects of the form {value, href, label} or null. Alternatively, columns with type=link must have a get$(row) function which returns observables which emit objects of the form {value, href, label} or null'
  );
  invariant(
    col.disableSorting || typeof col.typeArgs.comparator === 'function',
    'Columns with type=link must have a comparator(contentA, contentB) function'
  );
}

export function initialize(row, columnDefinition, columnIndex, emitRawDataChange) {
  const col = {
    columnDefinition,
    columnIndex,
    value: null,
    content: null,
    subscription: null,
    comparator: columnDefinition.typeArgs.comparator,
    refreshContent: noop,
    requiresContentRefresh: false
  };

  if (columnDefinition.typeArgs.get) {
    const result = columnDefinition.typeArgs.get(row.rowConfig);
    setResult(result, col, row, emitRawDataChange);
  } else {
    if (columnDefinition.typeArgs.showLoadingIndicator) {
      col.content = cellLoadingIndicatorInstance;
    }
    const result$ = columnDefinition.typeArgs.get$(row.rowConfig);
    col.subscription = result$.subscribe(setResult, null, col, row, emitRawDataChange);
  }

  return col;
}

function setResult(result, col, row, emitRawDataChange) {
  if (result == null) {
    col.value = null;

    if (col.columnDefinition.typeArgs.showLoadingIndicator) {
      col.content = cellLoadingIndicatorInstance;
    } else {
      col.content = null;
    }
  } else {
    col.value = result.value;
    if (result.href) {
      col.content = <Link href={result.href}>{result.label}</Link>;
    } else {
      col.content = result.label;
    }
  }
  row.mutationCount++;
  emitRawDataChange();
}
