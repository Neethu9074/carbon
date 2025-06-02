/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm } from 'formalistic';

import { AccessRestriction } from '@instana/types';

import { ScopeFormFields } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeDialog.form';

export interface LimitedAccessSwitcherProps {
  limitedAccessSwitchLabel: string;
  limitedAccessScopes: AccessRestriction[];
  onChange?: (scopeType: 'entire-unit' | 'limited-access') => void;
  onEntireUnitSelected?: () => MapForm<ScopeFormFields>;
}

export interface ToggleAccessPermissions {
  current: Array<AccessRestriction>;
  limited?: boolean;
  toAddOnEnabled?: Array<AccessRestriction>;
  toRemoveOnDisabled?: Array<AccessRestriction>;
}
