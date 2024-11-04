/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ReactNode } from 'react';

import { Observable } from '@instana/observables';

import { Action, Event } from 'in-types';

interface ActionTableProps {
  title?: string;
  pageSize?: number;
  rightHeader?: ReactNode;
  loadEntities: () => Observable<Action[]>;
  tableActions?: TableActions<Action>;
  noDataMessage?: string;
  hiddenIds?: string[];
  getEntityName?: (action: Action) => string;
  showExecuteColumn?: boolean | undefined;
  volatileId?: VolatileId;
  event?: Event;
}

export interface SelectListDialogContentProps {
  limit?: number;
  listComponent: ({
    setTitle,
    pageSize,
    hiddenIds,
    hasRowNavigation,
    noDataMessage,
    onRowClick,
    tableActions,
    rightHeader,
    inSelectListDialog
  }: {
    setTitle: false;
    pageSize: number;
    hiddenIds: SelectListDialogContentProps['hiddenIds'];
    hasRowNavigation: false;
    noDataMessage: string;
    onRowClick: (entity: any) => void;
    tableActions: TableActions<any>;
    rightHeader: ReactNode;
    inSelectListDialog: true;
  }) => JSX.Element;
  hiddenIds: string[];
  onSubmit: (id: string[]) => void;
  renderCustomFormActions: (numberOfItems: number) => JSX.Element;
  pageSize: number;
  preventCloseOnSubmit: boolean;
  requiresAtLeastOneMessage?: string;
}

declare function SelectListDialogContent(props: SelectListDialogContentProps): JSX.Element;

export default SelectListDialogContent;
