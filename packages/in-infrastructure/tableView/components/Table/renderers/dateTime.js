/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import invariant from 'invariant';

import { formatDateTime } from 'in-services/formatters/date';
import { isNotBlank } from 'in-services/util/string';
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
  let value = columnDefinition.typeArgs.getValue(row.rowConfig);

  const isDate = value instanceof Date;
  const isNonEmptyString = typeof value === 'string' && isNotBlank(value);

  if (!value || value === '') {
    return null;
  }

  if (isDate) {
    value = value.getTime();
  } else if (isNonEmptyString) {
    const parsed = Date.parse(value);
    value = isNaN(parsed) ? null : parsed;
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
    refreshContent: noop,
    requiresContentRefresh: false
  };
}
