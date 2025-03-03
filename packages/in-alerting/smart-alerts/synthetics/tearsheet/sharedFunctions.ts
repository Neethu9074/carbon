/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { SyntheticAlertConfigWithMetadata } from '@instana/types';

import { t } from 'in-i18n';

export function getHeaderTitle(editMode: boolean): string {
  if (editMode) {
    return t('in-alerting:smartAlerts.synthetics.tearSheet.editTitle');
  }
  return t('in-alerting:smartAlerts.synthetics.tearSheet.createTitle');
}

export function duplicateAlertConfig(
  config: SyntheticAlertConfigWithMetadata
): SyntheticAlertConfigWithMetadata & { duplicateFrom?: string } {
  return {
    ...config,
    duplicateFrom: config.id,
    name: t('in-alerting:smartAlerts.titleCopyOf', { smartAlertTitle: config.name })
  };
}
