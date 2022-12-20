/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import {TagFilterExpressionElementUnion, TimeConfig} from '@instana/types';

import { StateManagementChildProps } from 'in-components/AnalyzeView/StateManagement';

export type SortDirection = 'ASC' | 'DESC';

export type OrderBy = {
  by: string;
  direction: SortDirection;
};

export interface LogsProps extends StateManagementChildProps {
  withoutHeader?: boolean;
  detailId?: string;
}

export interface GetDataParams {
  timeConfig: TimeConfig;
  orderBy: OrderBy;
  backendQueryModel: TagFilterExpressionElementUnion;
  dataSource: string;
  initialLogLines: number;
  retrievalSize: number;
  afterKey?: string;
}

export type HeaderActionProps = {
  orderBy: OrderBy;
  setOrder: ({ by, direction }: { by: string; direction: SortDirection }) => void;
};
