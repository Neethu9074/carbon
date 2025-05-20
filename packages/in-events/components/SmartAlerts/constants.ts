/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { t } from 'in-i18n';

export interface ConfigStats {
  [key: string]: number | undefined;
}

export const globalSmartAlerts = 'globalSmartAlerts';
export const smartAlerts = 'smartAlerts';
export const infraAlerts = 'infraAlerts';
export const syntheticAlerts = 'syntheticAlerts';
export const logAlerts = 'logAlerts';

export const TabList = [
  {
    id: globalSmartAlerts,
    label: t('in-events:eventsSmartAlerts.globalApplicationSmartAlert')
  },
  {
    id: smartAlerts,
    label: t('in-events:eventsSmartAlerts.ApplicationSmartAlert')
  },
  {
    id: infraAlerts,
    label: t('in-events:eventsSmartAlerts.infraSA')
  },
  {
    id: syntheticAlerts,
    label: t('in-events:eventsSmartAlerts.syntheticsSA')
  },
  {
    id: logAlerts,
    label: t('in-events:eventsSmartAlerts.logSA')
  }
];
