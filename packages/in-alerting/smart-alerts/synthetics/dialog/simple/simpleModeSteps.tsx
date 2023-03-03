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
import SimpleAlertConfigDialogStep3 from 'in-alerting/smart-alerts/components/dialog/simple/SimpleAlertConfigDialogStep3';
import DialogAlertProperties from 'in-alerting/smart-alerts/synthetics/dialog/simple/DialogAlertProperties';
import { t } from 'in-i18n';

export const stepConfigs = [
  {
    title: t('in-alerting:smartAlerts.synthetics.simple.stepConfigsStep3Title'),
    validateIntermediately: [['alertChannelIds']]
  },
  {
    title: t('in-alerting:smartAlerts.synthetics.simple.stepConfigsStep4Title'),
    validateIntermediately: [['alertChannelIds']]
  }
];

export const stepRenderers = [
  (parentProps: AlertConfigDialogPresenterProps & MainDialogControl) => (
    <SimpleAlertConfigDialogStep3 {...parentProps} />
  ),
  (parentProps: AlertConfigDialogPresenterProps & MainDialogControl) => <DialogAlertProperties {...parentProps} />
];
