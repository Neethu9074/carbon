/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

//@ts-expect-error TS migration
import AlertConfigTearSheetStep1 from 'in-alerting/smart-alerts/websites/TearSheet/steps/AlertConfigTearSheetStep1';
import { t } from 'in-i18n';

export const stepConfigsForCarbonTearSheet = [
  {
    title: t('in-alerting:smartAlerts.websites.tearSheet.step1.title'),
    validateIntermediately: [
      ['rule', 'entityType'],
      ['rule', 'metricName']
    ],
    description: t('in-alerting:smartAlerts.websites.tearSheet.step1.description'),
    component: AlertConfigTearSheetStep1
  }
];
