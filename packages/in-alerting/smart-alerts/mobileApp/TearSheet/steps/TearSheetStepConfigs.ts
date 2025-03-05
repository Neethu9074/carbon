/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import AlertConfigTearSheetStep1 from 'in-alerting/smart-alerts/mobileApp/TearSheet/steps/AlertConfigTearSheetStep1';
import { t } from 'in-i18n';

export const stepConfigsForCarbonTearSheet = [
  {
    title: t('in-alerting:smartAlerts.mobileApp.tearSheet.step1.title'),
    validateIntermediately: [
      ['rule', 'entityType'],
      ['rule', 'metricName']
    ],
    description: t('in-alerting:smartAlerts.mobileApp.tearSheet.step1.description'),
    component: AlertConfigTearSheetStep1
  }
];
