/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import locals from './ContentWrapper.mless';

export default function ContentWrapper({ children }: { children: ReactNode[] }) {
  return <div className={locals.wrapper}>{children}</div>;
}
