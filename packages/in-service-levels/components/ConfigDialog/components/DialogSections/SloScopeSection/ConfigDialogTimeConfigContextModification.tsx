/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { days } from 'in-services/time/time';

export default function ConfigDialogTimeConfigContextModification() {
  const timeWindowSizeForSevenDays = days.toMillis(7);
  const timeConfigModified = { autoRefresh: false, windowSize: timeWindowSizeForSevenDays };

  return timeConfigModified;
}
