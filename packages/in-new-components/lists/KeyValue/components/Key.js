/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import locals from './Key.mless';

export default function Key({ label, multiline }) {
  if (!label) {
    return null;
  }
  return (
    <span
      className={classNames({
        [locals.label]: true,
        [locals.ellipsis]: !multiline,
        [locals.multiline]: multiline
      })}
    >
      {label}
    </span>
  );
}
