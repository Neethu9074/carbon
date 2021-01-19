/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import './BreakAll.less';

export default function BreakAll({ children }) {
  return <span className="in-break-all">{children}</span>;
}
