/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import AlertConfigTearSheetStep1 from 'in-alerting/smart-alerts/synthetics/tearsheet/steps/AlertConfigTearSheetStep1';
import { t } from 'in-i18n';

export const stepConfigsForCarbonTearSheet = [
  {
    title: t('in-alerting:smartAlerts.synthetics.tearSheet.steps.step1Title'),
    validateIntermediately: [],
    component: AlertConfigTearSheetStep1
  }
];
