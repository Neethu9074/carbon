/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { t } from 'in-i18n';

export function getHeaderTitle(editMode: boolean): string {
  if (editMode) {
    return t('in-alerting:smartAlerts.infrastructure.tearSheet.editTitle');
  }
  return t('in-alerting:smartAlerts.infrastructure.tearSheet.createTitle');
}

export function duplicateAlertConfig(
  config: InfraSmartAlertConfigWithMetadata
): InfraSmartAlertConfigWithMetadata & { duplicateFrom?: string } {
  return {
    ...config,
    duplicateFrom: config.id,
    name: t('in-alerting:smartAlerts.titleCopyOf', { smartAlertTitle: config.name })
  };
}
