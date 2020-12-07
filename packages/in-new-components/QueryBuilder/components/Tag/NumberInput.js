import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import useThemedLocals from 'in-hooks/useThemedLocals';

import styleDefs from './NumberInput.mless';

export default function NumberInput({ value, placeholder, onChange, valid, minValue }) {
  const locals = useThemedLocals(styleDefs);

  return (
    <input
      className={evaluateClassNames({
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
