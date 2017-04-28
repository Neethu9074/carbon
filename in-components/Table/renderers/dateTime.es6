import invariant from 'invariant';

import { formatDateTime } from 'in-services/formatters/date';
import { compare } from 'in-services/util/number';
import { noop } from 'in-services/fixedObjects';

export const type = 'dateTime';

export function validate(col) {
  invariant(
    typeof col.typeArgs.getValue === 'function',
    'Columns with type=dateTime must have a getValue(row) function.'
  );
  invariant(
    col.typeArgs.getContent == null || typeof col.typeArgs.getContent === 'function',
    'Columns with type=dateTime must have a getContent(row) function or no getContent property.'
  );
}

export function initialize(row, columnDefinition, columnIndex) {
  const value = columnDefinition.typeArgs.getValue(row.rowConfig);
  if (__DEV__) {
    invariant(
      value == null || typeof value === 'number',
      'Values for columns with type=dateTime must be number or null!'
    );
  }
  let content;
  if (columnDefinition.typeArgs.getContent) {
    content = columnDefinition.typeArgs.getContent(value, row.rowConfig);
  } else {
    content = formatDateTime(value);
  }
  return {
    columnDefinition,
    columnIndex,
    value,
    content,
    subscription: null,
    comparator: compare,
    refreshContent: noop
  };
}
