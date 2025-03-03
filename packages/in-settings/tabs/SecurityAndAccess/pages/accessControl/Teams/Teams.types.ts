/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ReactNode } from 'react';

import { ApiTeam } from 'in-settings/tabs/SecurityAndAccess/api/teams';

export interface TeamRowData extends Omit<ApiTeam, 'scope'> {
  memberCount: number;
  scope: string;
}

export interface TeamRow<ROW_DATA> {
  id: string;
  memberCount: ReactNode;
  rowData: ROW_DATA;
  scope: ReactNode;
  tag: ReactNode;
}
