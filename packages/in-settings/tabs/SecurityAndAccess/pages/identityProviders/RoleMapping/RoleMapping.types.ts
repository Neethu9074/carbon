/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ReactNode } from 'react';

export interface RoleMappingRow<ROW_DATA> {
  id: string;
  key: ReactNode;
  value: ReactNode;
  role: ReactNode;
  team: ReactNode;
  rowData: ROW_DATA;
}
