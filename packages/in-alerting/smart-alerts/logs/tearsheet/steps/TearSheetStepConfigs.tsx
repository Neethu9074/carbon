/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import AlertConfigTearSheetStep1 from 'in-alerting/smart-alerts/logs/tearsheet/steps/AlertConfigTearSheetStep1';
import { t } from 'in-i18n';

export const stepConfigsForCarbonTearSheet = [
  {
    title: t('in-alerting:smartAlerts.logs.tearSheet.steps.step1Title'),
    validateIntermediately: [],
    component: AlertConfigTearSheetStep1
  }
];

export const stepConfigs = [
  {
    title: t('in-alerting:smartAlerts.logs.tearSheet.steps.step1Title'),
    validateIntermediately: []
  },

  {
    title: t('in-alerting:smartAlerts.logs.tearSheet.steps.step2Title'),
    validateIntermediately: [['name']]
  },
  {
    title: t('in-alerting:smartAlerts.logs.tearSheet.steps.step3Title'),
    validateIntermediately: []
  },
  {
    title: t('in-alerting:smartAlerts.logs.tearSheet.steps.step4Title'),
    validateIntermediately: []
  }
];
