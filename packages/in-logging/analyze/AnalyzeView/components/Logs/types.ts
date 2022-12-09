/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import {StateManagementChildProps} from 'in-components/AnalyzeView/StateManagement';

export type SortDirection = 'ASC' | 'DESC';

export type OrderBy = {
  by: string;
  direction: SortDirection;
};

export interface LogsProps extends StateManagementChildProps {
  withoutHeader?: boolean;
  detailId?: string;
}

export type HeaderActionProps = {
  orderBy: OrderBy;
  setOrder: ({ by, direction }: { by: string; direction: SortDirection }) => void;
};
