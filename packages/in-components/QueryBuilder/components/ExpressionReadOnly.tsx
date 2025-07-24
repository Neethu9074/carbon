/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import locals from './Expression.mless';

export default function ExpressionReadOnly({ children }: { children: ReactNode }) {
  return <div className={locals.expression_disablehover}>{children}</div>;
}
