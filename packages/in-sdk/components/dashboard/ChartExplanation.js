/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import locals from './ChartExplanation.mless';

export default function ChartExplanation({ children }) {
  return <p className={locals.explanation}>{children}</p>;
}
