/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ALERTING_SAVED, ALERTING_DELETE_CONFIRM } from 'in-services/tracking/eventNames';
import { AlertConfigType } from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import { track } from 'in-services/tracking/tracking';

export function trackAlertDeleteConfirm(id: string): void {
  track(ALERTING_DELETE_CONFIRM, { id });
}

export function trackAlertSaved<AlertConfig extends AlertConfigType>(
  alertConfig: AlertConfig,
  dialogMode: boolean
): void {
  track(ALERTING_SAVED, { alertConfig, dialogMode: dialogMode ? 'Simple' : 'Advanced' });
}
