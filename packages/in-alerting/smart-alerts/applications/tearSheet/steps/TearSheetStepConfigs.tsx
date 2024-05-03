/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

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
    validateIntermediately: []
  },
  {
    title: t('in-alerting:smartAlerts.applications.tearSheet.step2Title'),
    validateIntermediately: [],
    isOptional: true
  },
  {
    title: t('in-alerting:smartAlerts.applications.tearSheet.step3Title'),
    validateIntermediately: [],
    isOptional: true
  },
  {
    title: t('in-alerting:smartAlerts.applications.tearSheet.step4Title'),
    validateIntermediately: [],
    isOptional: true
  },
  {
    title: t('in-alerting:smartAlerts.applications.tearSheet.step5Title'),
    validateIntermediately: [],
    isOptional: true
  }
];

export const getStepRenderers = (props: AlertConfigTearSheetWithThresholdProps) => [
  () => (
    <AlertingTearSheetContent title={stepConfigs[0].title}>
      <AlertConfigTearSheetStep1 setLogMessagesListVisible {...props} />
    </AlertingTearSheetContent>
  ),
  () => (
    <AlertingTearSheetContent title={stepConfigs[1].title}>
      <AlertConfigTearSheetStep2 {...props} />
    </AlertingTearSheetContent>
  ),
  () => (
    <AlertingTearSheetContent title={stepConfigs[2].title}>
      <AlertConfigTearSheetStep3 {...props} />
    </AlertingTearSheetContent>
  ),
  () => (
    <AlertingTearSheetContent title={stepConfigs[3].title}>
      <AlertConfigTearSheetStep4 {...props} />
    </AlertingTearSheetContent>
  ),
  () => (
    <AlertingTearSheetContent title={stepConfigs[4].title}>
      <AlertConfigTearSheetStep5 {...props} />
    </AlertingTearSheetContent>
  )
];

export const getFooterActions = (
  editMode: boolean | undefined,
  backOrCancel: (oldStep: number) => void,
  cancelTearSheet: () => string
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
    onClick: () => undefined
  }
];
