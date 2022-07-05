/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ReactNode } from 'react';

import { Observable } from '@instana/observables';

interface ColumnDefinition {
  id: number | string;
  getContent: Function;
}

interface TableActions {
  delete: {
    deleteEntity: (entity) => Observable<any>;
  };
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
  searchAttributes?: (string | ((entity) => string))[] | string;
  searchPlaceholder?: string;
  searchMaxWidth?: number;
  rightHeader?: ReactNode;
  tableActions?: TableActions;
  getEntityName: Function;
}

declare function ListComponent(props: ListProps): JSX.Element;

export declare function leftHeaderWithSelectAll(
  entityName: string,
  inSelectListDialog: boolean,
  tableActions: object
): Function;

export declare function createNewEntityButton({
  labelNew,
  pathNew,
  onCreateNew,
  disabledMessage,
  trackEvent
}: {
  labelNew: string;
  pathNew: string;
  onCreateNew?: Function;
  disabledMessage?: string;
  trackEvent?: Function;
}): ReactNode;

export default ListComponent;
