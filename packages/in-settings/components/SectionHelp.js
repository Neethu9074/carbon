/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import locals from './typography.mless';

export default function SectionHelp({ children }) {
  return <div className={locals.sectionHelp}>{children}</div>;
}
