/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import './BreakAll.less';

export default function BreakAll({ children }: { children: ReactNode }) {
  return <span className="in-break-all">{children}</span>;
}
