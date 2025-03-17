/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

//@ts-expect-error TS migartion
import AlertConfigTearSheetStep3 from 'in-alerting/smart-alerts/mobileApp/TearSheet/steps/AlertConfigTearSheetStep3';
import AlertConfigTearSheetStep1 from 'in-alerting/smart-alerts/mobileApp/TearSheet/steps/AlertConfigTearSheetStep1';
import AlertConfigTearSheetStep2 from 'in-alerting/smart-alerts/mobileApp/TearSheet/steps/AlertConfigTearSheetStep2';
import AlertConfigTearSheetStep4 from 'in-alerting/smart-alerts/mobileApp/TearSheet/steps/AlertConfigTearSheetStep4';
import AlertConfigTearSheetStep5 from 'in-alerting/smart-alerts/mobileApp/TearSheet/steps/AlertConfigTearSheetStep5';
import { t } from 'in-i18n';

export const stepConfigsForCarbonTearSheet = [
  {
    title: t('in-alerting:smartAlerts.mobileApp.tearSheet.step1.title'),
    validateIntermediately: [
      ['rule', 'entityType'],
      ['rule', 'metricName'],
      ['rule', 'customEventName']
    ],
    description: t('in-alerting:smartAlerts.mobileApp.tearSheet.step1.description'),
    component: AlertConfigTearSheetStep1
  },
  {
    title: t('in-alerting:smartAlerts.mobileApp.tearSheet.step2.title'),
    validateIntermediately: [],
    component: AlertConfigTearSheetStep2
  },
  {
    title: t('in-alerting:smartAlerts.mobileApp.tearSheet.step3.title'),
    validateIntermediately: [
      ['threshold', 'value'],
      ['timeThreshold', 'timeWindow']
    ],
    component: AlertConfigTearSheetStep3
  },
  {
    title: t('in-alerting:smartAlerts.mobileApp.tearSheet.step4.title'),
    validateIntermediately: [['name']],
    component: AlertConfigTearSheetStep4
  },
  {
    title: t('in-alerting:smartAlerts.mobileApp.tearSheet.step5.title'),
    validateIntermediately: [],
    component: AlertConfigTearSheetStep5
  }
];
