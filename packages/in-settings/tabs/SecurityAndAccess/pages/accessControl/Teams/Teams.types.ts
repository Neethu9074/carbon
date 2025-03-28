/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ReactNode } from 'react';

export interface TeamRow<ROW_DATA> {
  id: string;
  name: ReactNode;
  rowData: ROW_DATA;
  scope: ReactNode;
  usersCount: ReactNode;
}
