/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import locals from './FullViewWrapper.mless';

export default function FullViewWrapper({ children }) {
  return <div className={locals.fullViewWrapper}>{children}</div>;
}
