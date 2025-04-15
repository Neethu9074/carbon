/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { FULLSCREEN, DIALOG, CHOICE_DIALOG } from 'in-alerting/smart-alerts/data/constants';
import { isSmartAlertDialogViewDefaultEnabled } from 'in-services/featureFlags';

export function getSmartAlertDisplayMode(dialogViewFF: boolean, tearSheetViewFF: boolean): string {
  if (dialogViewFF && tearSheetViewFF) return CHOICE_DIALOG;
  if (dialogViewFF) return DIALOG;
  if (tearSheetViewFF) return FULLSCREEN;

  return !isSmartAlertDialogViewDefaultEnabled ? FULLSCREEN : DIALOG;
}
