import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './Value.mless';

export default function Value({ value, theme, inverted, accentuated }) {
  return (
    <span
      className={evaluateClassNames({
        [locals.value]: true,
        [locals.inverted]: inverted,
        [locals.accentuated]: accentuated,
        [locals[theme]]: true
      })}
    >
      {value}
    </span>
  );
}
