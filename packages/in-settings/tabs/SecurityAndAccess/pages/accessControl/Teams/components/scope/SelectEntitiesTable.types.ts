/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ReactNode } from 'react';

import { Observable } from '@instana/observables';
import { Result } from '@instana/types';

import { ScopeTableFormFieldType } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeDialog.form';

export interface SelectEntitiesTableProps<I> {
  extractId: (entity: I) => string;
  extractName: (entity: I) => string;
  fieldName: ScopeTableFormFieldType;
  observable: () => Observable<Result<I[]>>;
  tableAddLabel: string;
  tableTitle: string;
  showTableHeader?: boolean;
}

export interface ScopeItemRow<ROW_DATA> {
  id: string;
  name: ReactNode;
  rowData: ROW_DATA;
}

export type MinimalSelectEntitiesProps<I> = Pick<
  SelectEntitiesTableProps<I>,
  'fieldName' | 'observable' | 'tableAddLabel' | 'tableTitle'
>;
