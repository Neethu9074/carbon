/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import locals from './TableExplanation.mless';

export default function TableExplanation({ children }) {
  return <p className={locals.explanation}>{children}</p>;
}
