/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

//@ts-expect-error TS migration
import AlertConfigTearSheetStep4 from 'in-alerting/smart-alerts/applications/tearSheet/steps/AlertConfigTearSheetStep4';
//@ts-expect-error TS migration
import AlertConfigTearSheetStep3 from 'in-alerting/smart-alerts/applications/tearSheet/steps/AlertConfigTearSheetStep3';
//@ts-expect-error
import AlertConfigTearSheetStep1 from 'in-alerting/smart-alerts/applications/tearSheet/steps/AlertConfigTearSheetStep1';
//@ts-expect-error
import AlertConfigTearSheetStep5 from 'in-alerting/smart-alerts/applications/tearSheet/steps/AlertConfigTearSheetStep5';
import AlertConfigTearSheetStep6 from 'in-alerting/smart-alerts/applications/tearSheet/steps/AlertConfigTearSheetStep6';
import AlertConfigTearSheetStep2 from 'in-alerting/smart-alerts/applications/tearSheet/steps/AlertConfigTearSheetStep2';
import { t } from 'in-i18n';

export const stepConfigsForCarbonTearSheet = [
  {
    title: t('in-alerting:smartAlerts.applications.tearSheet.step1Title'),
    validateIntermediately: [
      ['rule', 'message'],
      ['rule', 'statusCode'], // fail when from > to (comparison)
      ['rule', 'statusCode', 'statusCodeStart'], // fail on empty start field
      ['rule', 'statusCode', 'statusCodeEnd'], // fail on empty end field
      ['rule', 'level']
    ],
    description: t('in-alerting:smartAlerts.infrastructure.tearSheet.step1.header'),
    component: AlertConfigTearSheetStep1
  },
  {
    title: t('in-alerting:smartAlerts.applications.tearSheet.step2Title'),
    validateIntermediately: [['applications']],
    description: t('in-alerting:smartAlerts.infrastructure.tearSheet.step1.header'),
    component: AlertConfigTearSheetStep2
  },
  {
    title: t('in-alerting:smartAlerts.applications.tearSheet.step3Title'),
    description: t('in-alerting:smartAlerts.infrastructure.tearSheet.step1.header'),
    component: AlertConfigTearSheetStep3
  },
  {
    title: t('in-alerting:smartAlerts.applications.tearSheet.step4Title'),
    validateIntermediately: [
      ['threshold'],
      ['timeThreshold', 'timeWindow'],
      ['timeThreshold', 'violations'],
      ['timeThreshold', 'requests']
    ],
    description: t('in-alerting:smartAlerts.infrastructure.tearSheet.step1.header'),
    component: AlertConfigTearSheetStep4
  },
  {
    title: t('in-alerting:smartAlerts.applications.tearSheet.step5Title'),
    validateIntermediately: [['name']],
    description: t('in-alerting:smartAlerts.infrastructure.tearSheet.step1.header'),
    component: AlertConfigTearSheetStep5
  },
  {
    title: t('in-alerting:smartAlerts.applications.tearSheet.step6Title'),
    validateIntermediately: [],
    description: t('in-alerting:smartAlerts.infrastructure.tearSheet.step1.header'),
    component: AlertConfigTearSheetStep6
  }
];
