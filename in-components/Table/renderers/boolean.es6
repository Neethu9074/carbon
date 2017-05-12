import invariant from 'invariant';
import React from 'react';

import SavingToggle from 'in-components/Table/renderers/SavingToggle';
import { compare } from 'in-services/util/boolean';
import { noop } from 'in-services/fixedObjects';

export const type = 'boolean';

export function validate(col) {
  invariant(
    typeof col.typeArgs.getValue === 'function',
    'Columns with type=boolean must have a getValue(row) function.'
  );

  invariant(
    typeof col.typeArgs.onChange === 'function',
    'Columns with type=boolean must have a onChange(row, newValue) function.'
  );
}

export function initialize(row, columnDefinition, columnIndex) {
  const value = columnDefinition.typeArgs.getValue(row.rowConfig);
  if (__DEV__) {
    invariant(
      value == null || typeof value === 'boolean',
      'Values for columns with type=boolean must be strings or null!'
    );
  }
  const content = (
    <SavingToggle
      checked={value}
      onChange={value => columnDefinition.typeArgs.onChange(row.rowConfig, value)}
      status={columnDefinition.typeArgs.getStatus ? columnDefinition.typeArgs.getStatus(row.rowConfig) : null}
    />
  );
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
