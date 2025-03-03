/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { LogSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/logs/form/logAlertConfigTypes';
import { t } from 'in-i18n';

export function getHeaderTitle(editMode: boolean): string {
  if (editMode) {
    return t('in-alerting:smartAlerts.logs.tearSheet.editTitle');
  }
  return t('in-alerting:smartAlerts.logs.tearSheet.createTitle');
}

export function duplicateAlertConfig(
  config: LogSmartAlertConfigWithMetadata
): LogSmartAlertConfigWithMetadata & { duplicateFrom?: string } {
  return {
    ...config,
    duplicateFrom: config.id,
    name: t('in-alerting:smartAlerts.titleCopyOf', { smartAlertTitle: config.name })
  };
}
