import classNames from 'classnames';
import React from 'react';

import locals from './Value.mless';

export default function Value({ value, theme, accentuated }) {
  if (value === undefined) {
    return null;
  }

  return (
    <span
      className={classNames({
        [locals.value]: true,
        [locals.accentuated]: accentuated,
        [locals[theme]]: true
      })}
    >
      {value}
    </span>
  );
}
