import React from 'react';

import classNames from 'classnames';

import locals from './Value.mless';

export default function Value({ value, theme, accentuated }) {
  if (!value) {
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
