/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import locals from './StackTraceLines.mless';

export default function StackTraceLines({ children }) {
  return <ol className={locals.lines}>{children}</ol>;
}
