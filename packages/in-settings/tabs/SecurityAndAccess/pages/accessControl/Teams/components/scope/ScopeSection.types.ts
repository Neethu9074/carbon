/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ReactNode } from 'react';

import { AccessRestriction, Result } from '@instana/types';
import { Observable } from '@instana/observables';

import { ScopeTableFormFieldType } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeDialog.form';

export interface ScopeSectionProps<I> {
  extractId: (entity: I) => string;
  extractName: (entity: I) => string;
  fieldName: ScopeTableFormFieldType;
  limitedAccessSwitchLabel: string;
  observable: () => Observable<Result<I[]>>;
  limitedAccessScopes: AccessRestriction[];
  tableAddLabel: string;
  tableTitle: string;
}

export interface ScopeItemRow<ROW_DATA> {
  id: string;
  name: ReactNode;
  rowData: ROW_DATA;
}

export interface ToggleAccessPermissions {
  current: Array<AccessRestriction>;
  limited?: boolean;
  toAddOnEnabled?: Array<AccessRestriction>;
  toRemoveOnDisabled?: Array<AccessRestriction>;
}
