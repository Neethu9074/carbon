/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Dispatch, SetStateAction } from 'react';

import { AlertConfigTearSheetWithThresholdProps } from 'in-alerting/smart-alerts/infrastructure/tearsheet/AlertConfigTearSheetWithThreshold';
import AlertConfigTearSheetStep1 from 'in-alerting/smart-alerts/infrastructure/tearsheet/steps/AlertConfigTearSheetStep1';
import AlertConfigTearSheetStep2 from 'in-alerting/smart-alerts/infrastructure/tearsheet/steps/AlertConfigTearSheetStep2';
import AlertConfigTearSheetStep3 from 'in-alerting/smart-alerts/infrastructure/tearsheet/steps/AlertConfigTearSheetStep3';
import AlertConfigTearSheetStep4 from 'in-alerting/smart-alerts/infrastructure/tearsheet/steps/AlertConfigTearSheetStep4';
import AlertingTearSheetContent from 'in-alerting/components/AlertingTearSheetContent';
import { AlertingFooterActions } from 'in-alerting/components/AlertingTearSheet';
import { Nullish, Result, StaticThresholdData } from 'in-types';
import { t } from 'in-i18n';

export const stepConfigs = [
  {
    title: t('in-alerting:smartAlerts.infrastructure.tearSheet.steps.step1Title'),
    validateIntermediately: [
      ['rule', 'entityType'],
      ['rule', 'metricName']
    ]
  },

  {
    title: t('in-alerting:smartAlerts.infrastructure.tearSheet.steps.step2Title'),
    validateIntermediately: []
  },
  {
    title: t('in-alerting:smartAlerts.infrastructure.tearSheet.steps.step3Title'),
    validateIntermediately: [['name']]
  },
  {
    title: t('in-alerting:smartAlerts.infrastructure.tearSheet.steps.step4Title'),
    validateIntermediately: []
  }
];

export type stepRendersType = AlertConfigTearSheetWithThresholdProps & {
  isTagFilterFormModelValid: boolean;
  setStep: Dispatch<SetStateAction<number>>;
  thresholdResult: Result<StaticThresholdData> | undefined | null;
  setTagFilterValid: Dispatch<SetStateAction<boolean>>;
};

export const infraStepRenderers = [
  (props: stepRendersType) => (
    <AlertingTearSheetContent title={stepConfigs[0].title} key={0}>
      <AlertConfigTearSheetStep1 {...props} />
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
  )
];

export const getFooterActions = (
  backOrCancel: (oldStep: number) => void,
  cancelTearSheet: () => string | Nullish,
  handleSubmit: () => void,
  editMode: boolean | undefined
): AlertingFooterActions[] => [
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
    label: getButtonLabel(editMode),
    onClick: () => handleSubmit()
  }
];

export function getButtonLabel(editMode?: boolean) {
  if (editMode) {
    return t('in-alerting:smartAlerts.components.smartAlertDialog.buttonSave');
  }
  return t('in-alerting:smartAlerts.components.smartAlertDialog.buttonCreate');
}
