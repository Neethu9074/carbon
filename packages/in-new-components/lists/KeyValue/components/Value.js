/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import locals from './Value.mless';

export default function Value({ value, theme, accentuated, multiline }) {
  if (value === undefined) {
    return null;
  }

  return (
    <span
      className={classNames({
        [locals.value]: true,
        [locals.accentuated]: accentuated,
        [locals[theme]]: true,
        [locals.ellipsis]: !multiline,
        [locals.multiline]: multiline
      })}
    >
      {value}
    </span>
  );
}
