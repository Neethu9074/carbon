/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import useThemedLocals from 'in-hooks/useThemedLocals';

import styleDefs from './NumberInput.mless';

export default function NumberInput({ value, placeholder, onChange, valid, minValue }) {
  const locals = useThemedLocals(styleDefs);

  return (
    <input
      className={classNames({
        [locals.input]: true,
        [locals.invalid]: !valid
      })}
      value={value ?? ''}
      min={minValue}
      type="number"
      placeholder={placeholder}
      onChange={e => {
        const v = e.target.valueAsNumber;
        onChange(isNaN(v) || v < minValue ? null : v);
      }}
    />
  );
}
