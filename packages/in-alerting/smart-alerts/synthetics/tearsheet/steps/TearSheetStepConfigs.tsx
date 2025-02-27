/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import AlertConfigTearSheetStep1 from 'in-alerting/smart-alerts/synthetics/tearsheet/steps/AlertConfigTearSheetStep1';
import AlertConfigTearSheetStep2 from 'in-alerting/smart-alerts/synthetics/tearsheet/steps/AlertConfigTearSheetStep2';
import AlertConfigTearSheetStep3 from 'in-alerting/smart-alerts/synthetics/tearsheet/steps/AlertConfigTearSheetStep3';
import AlertConfigTearSheetStep4 from 'in-alerting/smart-alerts/synthetics/tearsheet/steps/AlertConfigTearSheetStep4';
import { t } from 'in-i18n';

export const stepConfigsForCarbonTearSheet = [
  {
    title: t('in-alerting:smartAlerts.synthetics.tearSheet.steps.step1Title'),
    validateIntermediately: [],
    component: AlertConfigTearSheetStep1
  },
  {
    title: t('in-alerting:smartAlerts.synthetics.tearSheet.steps.step2Title'),
    validateIntermediately: [],
    component: AlertConfigTearSheetStep2
  },
  {
    title: t('in-alerting:smartAlerts.synthetics.tearSheet.steps.step3Title'),
    validateIntermediately: [['name']],
    component: AlertConfigTearSheetStep3
  },
  {
    title: t('in-alerting:smartAlerts.synthetics.tearSheet.steps.step4Title'),
    validateIntermediately: [],
    component: AlertConfigTearSheetStep4
  }
];
