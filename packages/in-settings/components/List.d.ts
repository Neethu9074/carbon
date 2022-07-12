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

interface TableActionsDefinition {
  delete: {
    deleteEntity: (entity) => Observable<any>;
  };
  deselect: {
    deselectedEntity: (entity) => Observable<any>;
  };
}

interface extraFiltersDef {
  id: string;
  name: string;
  type: string;
  createdAt: Date;
  modifiedAt: Date;
}

interface ListProps {
  title?: ReactNode;
  noDataMessage?: string;
  pageSize?: number;
  initialOrderBy?: string;
  isSearchable?: boolean;
  loadEntities?: () => void;
  columnDefinitions: ColumnDefinition[];
  getHeader?: Function;
  searchAttributes?: string[];
  searchPlaceholder?: string;
  searchMaxWidth?: number;
  extraFilters?: ((action: extraFiltersDef) => void)[];
  rightHeader?: ReactNode;
  tableActions?: tableActionsDefinition;
}

declare function ListComponent(props: ListProps): JSX.Element;

export declare function leftHeaderWithSelectAll(
  entityName: string,
  inSelectListDialog: boolean,
  trackEvent: object
): Function;

export default ListComponent;
