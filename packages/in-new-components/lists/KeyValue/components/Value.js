import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './Value.mless';

export default function Value({ value, theme, accentuated }) {
  if (!value) {
    return null;
  }

  return (
    <span
      className={evaluateClassNames({
        [locals.value]: true,
        [locals.accentuated]: accentuated,
        [locals[theme]]: true
      })}
    >
      {value}
    </span>
  );
}
