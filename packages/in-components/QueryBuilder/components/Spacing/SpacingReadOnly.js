/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import locals from './Spacing.mless';

export default function SpacingReadOnly() {
  return (
    <div
      className={classNames({
        [locals.letter_disablehover]: true,
        [locals.word_disablehover]: true
      })}
    />
  );
}
