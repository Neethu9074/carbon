/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  ALERTING_CREATE,
  ALERTING_SAVED,
  ALERTING_UPDATED,
  ALERTING_EDIT,
  ALERTING_DELETE_TRIGGER,
  ALERTING_DELETE_CONFIRM,
  ALERTING_PAUSED,
  ALERTING_RESUMED
} from 'in-services/tracking/eventNames';
import { AlertConfigType } from 'in-alerting/smart-alerts/components/AlertsBaseList';
import { track } from 'in-services/tracking/tracking';

export function trackStartCreate(): void {
  track(ALERTING_CREATE);
}

export function trackAlertEdit<AlertConfig extends AlertConfigType>(alertConfig: AlertConfig): void {
  track(ALERTING_EDIT, { alertConfig });
}

export function trackAlertDeleteTrigger<AlertConfig extends AlertConfigType>(alertConfig: AlertConfig): void {
  track(ALERTING_DELETE_TRIGGER, { alertConfig });
}

export function trackAlertDeleteConfirm(id: string): void {
  track(ALERTING_DELETE_CONFIRM, { id });
}

export function trackAlertPaused<AlertConfig extends AlertConfigType>(alertConfig: AlertConfig): void {
  track(ALERTING_PAUSED, { alertConfig });
}

export function trackAlertResumed<AlertConfig extends AlertConfigType>(alertConfig: AlertConfig): void {
  track(ALERTING_RESUMED, { alertConfig });
}

export function trackAlertSaved<AlertConfig extends AlertConfigType>(
  alertConfig: AlertConfig,
  dialogMode: boolean
): void {
  track(ALERTING_SAVED, { alertConfig, dialogMode: dialogMode ? 'Simple' : 'Advanced' });
}
export function trackAlertUpdated<AlertConfig extends AlertConfigType>(alertConfig: AlertConfig): void {
  track(ALERTING_UPDATED, { alertConfig });
}
