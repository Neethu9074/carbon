/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  AlertConfigDialogPresenterProps,
  MainDialogControl
} from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import SimpleAlertConfigDialogStep2 from 'in-alerting/smart-alerts/synthetics/dialog/simple/SimpleAlertConfigDialogStep2';
import SimpleAlertConfigDialogStep1 from 'in-alerting/smart-alerts/synthetics/dialog/simple/SimpleAlertConfigDialogStep1';
import SimpleAlertConfigDialogStep3 from 'in-alerting/smart-alerts/components/dialog/simple/SimpleAlertConfigDialogStep3';
import SimpleModeDialogThreshold from 'in-alerting/smart-alerts/synthetics/dialog/simple/SimpleModeDialogThreshold';
import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import DialogAlertProperties from 'in-alerting/smart-alerts/synthetics/dialog/simple/DialogAlertProperties';
import { t } from 'in-i18n';

export const stepConfigs = [
  {
    title: t('in-alerting:smartAlerts.synthetics.simple.stepConfigsStep1Title')
  },
  {
    title: t('in-alerting:smartAlerts.synthetics.simple.stepConfigsStep2Title')
  },
  {
    title: t('in-alerting:smartAlerts.synthetics.simple.stepConfigsStep3Title')
  },
  {
    title: t('in-alerting:smartAlerts.synthetics.simple.stepConfigsStep4Title')
  },
  {
    title: t('in-alerting:smartAlerts.synthetics.simple.stepConfigsStep5Title')
  }
];

export const stepRenderers = [
  (parentProps: AlertConfigDialogPresenterProps & MainDialogControl) => (
    <SimpleAlertConfigDialogStep1 {...parentProps} />
  ),
  (parentProps: AlertConfigDialogPresenterProps & MainDialogControl) => (
    <SimpleAlertConfigDialogStep2 {...parentProps} />
  ),
  (parentProps: AlertConfigDialogPresenterProps & MainDialogControl) => (
    <SimpleModeStepContentWrapper
      headline={t('in-alerting:smartAlerts.synthetics.simple.thresholdTitle')}
      titleToolTipText={t('in-alerting:smartAlerts.synthetics.simple.thresholdTitleHelpText')}
    >
      <SimpleModeDialogThreshold
        {...parentProps}
        subTitleToolTipText={t('in-alerting:smartAlerts.synthetics.simple.thresholdSubTitleHelpText')}
      />
    </SimpleModeStepContentWrapper>
  ),
  (parentProps: AlertConfigDialogPresenterProps & MainDialogControl) => (
    <SimpleAlertConfigDialogStep3 {...parentProps} />
  ),
  (parentProps: AlertConfigDialogPresenterProps & MainDialogControl) => <DialogAlertProperties {...parentProps} />
];
