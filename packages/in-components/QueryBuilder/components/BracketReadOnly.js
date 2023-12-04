/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { OPEN_BRACKET } from 'in-components/QueryBuilder/transformation/renderModel';
import useThemedLocals from 'in-hooks/useThemedLocals';

import styleDefs from './Bracket.mless';

export default function BracketReadOnly({ element: { type } }) {
  const locals = useThemedLocals(styleDefs);

  return (
    <div
      className={classNames({
        [locals.bracket_disablehover]: true
      })}
    >
      {type === OPEN_BRACKET ? '(' : ')'}
    </div>
  );
}
