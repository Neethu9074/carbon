/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import useThemedLocals from 'in-hooks/useThemedLocals';

import styleDefs from './Conjunction.mless';

export default function ConjunctionReadOnly({ element: { logicalOperator } }) {
  const locals = useThemedLocals(styleDefs);

  return (
    <div className={locals.conjunction} style={{ cursor: 'not-allowed' }}>
      {logicalOperator}
    </div>
  );
}
