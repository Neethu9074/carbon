/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { t } from '@instana/i18n-react';

export function massageLocationDisplayLabel(displayLabel: string, id: string) {
  //If a location is deleted, its display label is empty, set it as locationId + '-deleted'
  return displayLabel.length > 0 ? displayLabel : t('in-synthetics:dashboard.deleted', { id });
}
