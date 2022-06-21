/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ReactNode } from 'react';

interface ColumnDefinition {
  id: number | string;
  getContent: function;
}

interface ListProps {
  title?: ReactNode;
  noDataMessage?: string;
  pageSize?: number;
  initialOrderBy?: string;
  isSearchable?: boolean;
  loadEntities: function;
  columnDefinitions: ColumnDefinition[];
  getHeader?: function;
  searchAttributes?: string[];
  searchPlaceholder?: string;
  searchMaxWidth?: number;
}

declare function ListComponent(props: ListProps): JSX.Element;

export declare function leftHeaderWithSelectAll(
  entityName: string,
  inSelectListDialog: boolean,
  tableActions: object
): function;

export default ListComponent;
