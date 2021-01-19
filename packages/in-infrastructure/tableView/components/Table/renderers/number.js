/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import invariant from 'invariant';
import React from 'react';

import PercentageCell from 'in-infrastructure/tableView/components/Table/components/PercentageCell';
import { compare } from 'in-services/util/number';
import { percentage } from 'in-services/formatters/number';
import { noop } from 'in-services/fixedObjects';

export const type = 'number';

export function validate(col) {
  invariant(
    typeof col.typeArgs.getValue === 'function',
    'Columns with type=number must have a getValue(row) function.'
  );
  invariant(
    typeof col.typeArgs.getContent === 'function',
    'Columns with type=number must have a getContent(value, row) function.'
  );
}

export function initialize(row, columnDefinition, columnIndex) {
  const value = columnDefinition.typeArgs.getValue(row.rowConfig);
  if (__DEV__) {
    invariant(
      value == null || typeof value === 'number',
      'Values for columns with type=number must be numbers or null!'
    );
  }
  let content = columnDefinition.typeArgs.getContent(value);
  if (shouldPresentValueAsPercentage(columnDefinition.typeArgs.getContent)) {
    content = <PercentageCell value={value} content={content} />;
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

function shouldPresentValueAsPercentage(getContentFn) {
  return getContentFn === percentage.compact || getContentFn === percentage.detailed;
}
