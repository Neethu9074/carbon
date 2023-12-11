/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import locals from './Expression.mless';

export default function ExpressionReadOnly({ children }) {
  return <div className={locals.expression_disablehover}>{children}</div>;
}
