/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { TagFilter, TimeConfig } from '@instana/types';

import { GetHrefToGroupedView } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/types';
import { StateManagementProps } from 'in-components/AnalyzeView/StateManagement';

export type SortDirection = 'ASC' | 'DESC';

export type OrderBy = {
  by: string;
  direction: SortDirection;
};

export interface LogsProps extends StateManagementProps {
  withoutHeader: boolean;
  detailId: string;
  getHrefWithAdditionalTagFilter?: (tag: TagFilter) => string;
  getHrefToGroupedView?: GetHrefToGroupedView;
  initialLogLines?: number;
}

export interface GetDataParams {
  timeConfig: TimeConfig;
  orderBy: OrderBy;
  backendQueryModel: Record<string, string>;
  dataSource: string;
  initialLogLines: number;
  retrievalSize: number;
  afterKey?: string;
}

export type HeaderActionProps = {
  orderBy: OrderBy;
  setOrder: ({ by, direction }: { by: string; direction: SortDirection }) => void;
};
