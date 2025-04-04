/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ReactNode } from 'react';

import { TeamScope } from '@instana/types';

export interface ScopeSectionProps {
  limitedAccessSwitchLabel: string;
  scope?: TeamScope;
  tableAddLabel: string;
  tableTitle: string;
}

export interface ScopeItemRow<ROW_DATA> {
  id: string;
  name: ReactNode;
  rowData: ROW_DATA;
}

export interface ScopeItemResult {
  readonly id: string;
  readonly name: string;
}
