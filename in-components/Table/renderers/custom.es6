import invariant from 'invariant';

import { noop } from 'in-services/fixedObjects';

export const type = 'custom';

export function validate(col) {
  invariant(
    typeof col.typeArgs.get === 'function',
    'Columns with type=custom must have a get(row) function. This function must return a stream which emits objects of the form {value, content} or null'
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

  const valueAndContent$ = columnDefinition.typeArgs.get(row.rowConfig);
  col.subscription = valueAndContent$.subscribe(result => {
    if (result == null) {
      col.value = null;
      col.content = null;
    } else {
      col.value = result.value;
      col.content = result.content;
    }
    row.mutationCount++;
    emitRawDataChange();
  });

  return col;
}
