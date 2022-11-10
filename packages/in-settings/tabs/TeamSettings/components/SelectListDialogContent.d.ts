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

interface SelectListDialogContentProps {
  limit?: number;
  listComponent: ({
    title,
    pageSize,
    rightHeader,
    loadEntities,
    noDataMessage,
    tableActions,
    hiddenIds,
    getEntityName,
    showExecuteColumn,
    volatileId,
    event
  }: ActionTableProps) => JSX.Element;
  hiddenIds: string[];
  onSubmit: (id: string[]) => void;
  renderCustomFormActions: (numberOfItems: number) => JSX.Element;
  pageSize: number;
  preventCloseOnSubmit: boolean;
  requiresAtLeastOneMessage: string;
}

declare function SelectListDialogContent(props: SelectListDialogContentProps): JSX.Element;

export default SelectListDialogContent;
