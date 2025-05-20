/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { AccessRestriction } from '@instana/types';

export interface LimitedAccessSwitcherProps {
  limitedAccessSwitchLabel: string;
  limitedAccessScopes: AccessRestriction[];
  onChange?: (scopeType: 'entire-unit' | 'limited-access') => void;
}

export interface ToggleAccessPermissions {
  current: Array<AccessRestriction>;
  limited?: boolean;
  toAddOnEnabled?: Array<AccessRestriction>;
  toRemoveOnDisabled?: Array<AccessRestriction>;
}
