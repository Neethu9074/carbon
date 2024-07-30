/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Dispatch, SetStateAction } from 'react';

//@ts-expect-error TS migration
import AlertConfigTearSheetStep4 from 'in-alerting/smart-alerts/applications/tearSheet/steps/AlertConfigTearSheetStep4';
//@ts-expect-error TS migration
import AlertConfigTearSheetStep3 from 'in-alerting/smart-alerts/applications/tearSheet/steps/AlertConfigTearSheetStep3';
//@ts-expect-error
import AlertConfigTearSheetStep1 from 'in-alerting/smart-alerts/applications/tearSheet/steps/AlertConfigTearSheetStep1';
import { AlertConfigTearSheetWithThresholdProps } from 'in-alerting/smart-alerts/applications/tearSheet/AlertConfigTearSheetWithThreshold';
//@ts-expect-error
import AlertConfigTearSheetStep5 from 'in-alerting/smart-alerts/applications/tearSheet/steps/AlertConfigTearSheetStep5';
import AlertConfigTearSheetStep2 from 'in-alerting/smart-alerts/applications/tearSheet/steps/AlertConfigTearSheetStep2';
import AlertingTearSheetContent from 'in-alerting/components/AlertingTearSheetContent';
import { t } from 'in-i18n';

export const stepConfigs = [
  {
    title: t('in-alerting:smartAlerts.applications.tearSheet.step1Title'),
    validateIntermediately: [
      ['rule', 'message'],
      ['rule', 'statusCode'], // fail when from > to (comparison)
      ['rule', 'statusCode', 'statusCodeStart'], // fail on empty start field
      ['rule', 'statusCode', 'statusCodeEnd'], // fail on empty end field
      ['rule', 'level']
    ]
  },
  {
    title: t('in-alerting:smartAlerts.applications.tearSheet.step2Title'),
    isOptional: true,
    validateIntermediately: [['applications']]
  },
  {
    title: t('in-alerting:smartAlerts.applications.tearSheet.step3Title'),
    isOptional: true
  },
  {
    title: t('in-alerting:smartAlerts.applications.tearSheet.step4Title'),
    isOptional: true,
    validateIntermediately: [
      ['threshold', 'value'],
      ['timeThreshold', 'timeWindow'],
      ['timeThreshold', 'violations'],
      ['timeThreshold', 'requests']
    ]
  },
  {
    title: t('in-alerting:smartAlerts.applications.tearSheet.step5Title'),
    isOptional: true,
    validateIntermediately: [['name']]
  }
];

export type stepRendersType = AlertConfigTearSheetWithThresholdProps & {
  isTagFilterFormModelValid: boolean;
  setStep: Dispatch<SetStateAction<number>>;
};

export const APStepRenderers = [
  (props: stepRendersType) => (
    <AlertingTearSheetContent title={stepConfigs[0].title} key={0}>
      <AlertConfigTearSheetStep1 setLogMessagesListVisible {...props} />
    </AlertingTearSheetContent>
  ),
  (props: stepRendersType) => (
    <AlertingTearSheetContent title={stepConfigs[1].title} key={1}>
      <AlertConfigTearSheetStep2 {...props} />
    </AlertingTearSheetContent>
  ),
  (props: stepRendersType) => (
    <AlertingTearSheetContent title={stepConfigs[2].title} key={2}>
      <AlertConfigTearSheetStep3 {...props} />
    </AlertingTearSheetContent>
  ),
  (props: stepRendersType) => (
    <AlertingTearSheetContent title={stepConfigs[3].title} key={3}>
      <AlertConfigTearSheetStep4 {...props} />
    </AlertingTearSheetContent>
  ),
  (props: stepRendersType) => (
    <AlertingTearSheetContent title={stepConfigs[4].title} key={4}>
      <AlertConfigTearSheetStep5 {...props} />
    </AlertingTearSheetContent>
  )
];

export const getFooterActions = (
  editMode: boolean | undefined,
  backOrCancel: (oldStep: number) => void,
  cancelTearSheet: () => string,
  handleSubmit: () => void
) => [
  {
    kind: 'ghost',
    isLeftAlign: true,
    label: t('in-alerting:smartAlerts.components.smartAlertDialog.cancelTitle'),
    href: cancelTearSheet()
  },
  {
    kind: 'secondary',
    isLeftAlign: false,
    label: t('in-alerting:smartAlerts.components.smartAlertDialog.previousTitle'),
    onClick: backOrCancel
  },
  {
    kind: 'primary',
    isLeftAlign: false,
    label: editMode
      ? t('in-alerting:smartAlerts.components.smartAlertDialog.buttonSave')
      : t('in-alerting:smartAlerts.components.smartAlertDialog.buttonCreate'),
    onClick: () => handleSubmit()
  }
];
