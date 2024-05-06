/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useContext } from 'react';

// eslint-disable-next-line no-restricted-imports
import { SloAlertFormContext, sloAlertFormContext } from 'in-alerting/smart-alerts/slo/form/SloAlertFormProvider';

export function useSloAlertFormContext(): SloAlertFormContext {
  const context = useContext(sloAlertFormContext);

  if (context === undefined) {
    throw new Error('useSloAlertForm must be used within a SloAlertFormProvider');
  }

  return context;
}
