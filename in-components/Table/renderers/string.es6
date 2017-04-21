import invariant from 'invariant';

import { compareIgnoreCase } from 'in-services/util/string';
import { noop } from 'in-services/fixedObjects';

export const type = 'string';

export function validate(col) {
  invariant(
    typeof col.typeArgs.getValue === 'function',
    'Columns with type=string must have a getValue(row) function.'
  );
  invariant(
    col.typeArgs.getContent == null || typeof col.typeArgs.getContent === 'function',
    'Columns with type=string must have a getContent(row) function or no getContent property.'
  );
}

export function initialize(row, columnDefinition, columnIndex) {
  const value = columnDefinition.typeArgs.getValue(row.rowConfig);
  let content = value;
  if (columnDefinition.typeArgs.getContent) {
    content = columnDefinition.typeArgs.getContent(value, row.rowConfig);
  }
  return {
    columnDefinition,
    columnIndex,
    value,
    content,
    subscription: null,
    comparator: compareIgnoreCase,
    refreshContent: noop
  };
}
