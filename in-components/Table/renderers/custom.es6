import invariant from 'invariant';

import { noop } from 'in-services/fixedObjects';

export const type = 'custom';

export function validate(col) {
  invariant(
    typeof col.typeArgs.get === 'function' || typeof col.typeArgs.get$ === 'function',
    'Columns with type=custom must have a get(row) function which returns objects of the form {value, content} or null. Alternatively, columns with type=custom must have a get$(row) function which returns observables which emit objects of the form {value, content} or null'
  );
  invariant(
    typeof col.typeArgs.comparator === 'function',
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
    const valueAndContent = columnDefinition.typeArgs.get(row.rowConfig);
    setResult(valueAndContent, col, row, emitRawDataChange);
  } else {
    const valueAndContent$ = columnDefinition.typeArgs.get$(row.rowConfig);
    col.subscription = valueAndContent$.subscribe(setResult, null, col, row, emitRawDataChange);
  }

  return col;
}

function setResult(result, col, row, emitRawDataChange) {
  if (result == null) {
    col.value = null;
    col.content = null;
  } else {
    col.value = result.value;
    col.content = result.content;
  }
  row.mutationCount++;
  emitRawDataChange();
}
