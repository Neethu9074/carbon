/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { LETTER, WORD } from 'in-new-components/QueryBuilder/transformation/renderModel';

import locals from './Spacing.mless';

export default function SpacingReadOnly({ element: { size } }) {
  return (
    <div
      style={{ cursor: 'not-allowed' }}
      className={classNames({
        [locals.letter]: size === LETTER.size,
        [locals.word]: size === WORD.size
      })}
    />
  );
}
