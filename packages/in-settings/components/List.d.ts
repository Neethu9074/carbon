/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ReactNode } from 'react';

interface ColumnDefinition {
  id: number | string;
  getContent: Function;
}

interface ListProps {
  title?: ReactNode;
  noDataMessage?: string;
  pageSize?: number;
  initialOrderBy?: string;
  isSearchable?: boolean;
  loadEntities: Function;
  columnDefinitions: ColumnDefinition[];
  getHeader?: Function;
  searchAttributes?: string[];
  searchPlaceholder?: string;
  searchMaxWidth?: number;
  extraFilters?: Function[];
  onRowClick?: Function;
  rightHeader?: ReactNode;
  tableActions?: object;
}

declare function ListComponent(props: ListProps): JSX.Element;

export declare function leftHeaderWithSelectAll(
  entityName: string,
  inSelectListDialog: boolean,
  trackEvent: object
): Function;

export default ListComponent;
