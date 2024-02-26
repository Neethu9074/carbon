/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { carbonShellEnabled } from 'in-services/featureFlags';

/**
 * Utility used to enable/disable the ui-shell individually by a user.
 *
 * Reminder: This could be deleted, after removing the feature flag.
 */
export function isCarbonShellEnabled() {
  const override = localStorage.getItem('ids-override-shell');
  if (override === 'carbon') {
    return true;
  } else if (override === 'instana') {
    return false;
  } else {
    // return feature flag value
    return carbonShellEnabled;
  }
}
