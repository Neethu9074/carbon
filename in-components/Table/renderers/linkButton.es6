import invariant from 'invariant';
import React from 'react';

import { noop } from 'in-services/fixedObjects';
import Button from 'in-components/Button';

export const type = 'linkButton';

export function validate(col) {
  invariant(
    typeof col.typeArgs.get === 'function' || typeof col.typeArgs.get$ === 'function',
    'Columns with type=custom must have a get(row) function which returns objects of the form {value, href, label} or null. Alternatively, columns with type=custom must have a get$(row) function which returns observables which emit objects of the form {value, href, label} or null'
  );
  invariant(
    col.disableSorting || typeof col.typeArgs.comparator === 'function',
    'Columns with type=custom must have a comparator(contentA, contentB) function'
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
    refreshContent: noop
  };

  if (columnDefinition.typeArgs.get) {
    const result = columnDefinition.typeArgs.get(row.rowConfig);
    setResult(result, col, row, emitRawDataChange);
  } else {
    const result$ = columnDefinition.typeArgs.get$(row.rowConfig);
    col.subscription = result$.subscribe(setResult, null, col, row, emitRawDataChange);
  }

  return col;
}

function setResult(result, col, row, emitRawDataChange) {
  if (result == null) {
    col.value = null;
    col.content = null;
  } else {
    col.value = result.value;
    col.content = (
      <Button href={result.href} size="sm" kind="secondary">
        {result.label}
      </Button>
    );
  }
  row.mutationCount++;
  emitRawDataChange();
}
