import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './Key.mless';

export default function Key({ label, theme, inverted, accentuated }) {
  return (
    <span
      className={evaluateClassNames({
        [locals.label]: true,
        [locals.inverted]: inverted,
        [locals.accentuated]: accentuated,
        [locals[theme]]: true
      })}
    >
      {label}
    </span>
  );
}
