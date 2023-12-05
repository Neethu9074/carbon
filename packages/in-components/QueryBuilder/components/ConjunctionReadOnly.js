/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import useThemedLocals from 'in-hooks/useThemedLocals';

import styleDefs from './Conjunction.mless';

export default function ConjunctionReadOnly({ element: { logicalOperator } }) {
  const locals = useThemedLocals(styleDefs);

  return (
    <div
      className={classNames({
        [locals.conjunction_disablehover]: true
      })}
    >
      {logicalOperator}
    </div>
  );
}
