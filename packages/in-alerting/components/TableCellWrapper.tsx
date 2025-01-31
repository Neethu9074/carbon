/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import locals from './TableCellWrapper.mless';

export function TableCellWrapper({ children }: { children: React.ReactNode }) {
  return <div className={locals.cellWidth}>{children}</div>;
}
