/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { OPEN_BRACKET } from 'in-new-components/QueryBuilder/transformation/renderModel';
import useThemedLocals from 'in-hooks/useThemedLocals';

import styleDefs from './Bracket.mless';

export default function BracketReadOnly({ element: { type } }) {
  const locals = useThemedLocals(styleDefs);

  return (
    <div className={locals.bracket} style={{ cursor: 'not-allowed' }}>
      {type === OPEN_BRACKET ? '(' : ')'}
    </div>
  );
}
