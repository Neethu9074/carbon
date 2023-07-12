/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import {
  AlertConfigDialogPresenterProps,
  MainDialogControl
} from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import { SimpleAlertConfigDialogStep2Props } from 'in-alerting/smart-alerts/mobileApp/dialog/simple/SimpleAlertConfigDialogStep2';
import SimpleAlertConfigDialogStep3 from 'in-alerting/smart-alerts/components/dialog/simple/SimpleAlertConfigDialogStep3';
import SimpleAlertConfigDialogStep1 from 'in-alerting/smart-alerts/mobileApp/dialog/simple/SimpleAlertConfigDialogStep1';
import SimpleAlertConfigDialogStep2 from 'in-alerting/smart-alerts/mobileApp/dialog/simple/SimpleAlertConfigDialogStep2';
import { t } from 'in-i18n';

export const stepConfigs = [
  {
    title: t('in-alerting:smartAlerts.mobileApp.simple.stepConfigsStep1Title'),
    validateIntermediately: [
      ['rule', 'value'],
      ['rule', 'customEventName']
    ]
  },
  {
    title: t('in-alerting:smartAlerts.mobileApp.simple.stepConfigsStep2Title')
  },
  {
    title: t('in-alerting:smartAlerts.mobileApp.simple.stepConfigsStep3Title')
  }
];

export interface UpdateForm {
  updateForm: (form: MapForm<any>) => void;
}

export const stepRenderers = [
  (parentProps: AlertConfigDialogPresenterProps & MainDialogControl & UpdateForm) => {
    return <SimpleAlertConfigDialogStep1 {...parentProps} />;
  },
  (parentProps: AlertConfigDialogPresenterProps & MainDialogControl & SimpleAlertConfigDialogStep2Props) => (
    <SimpleAlertConfigDialogStep2 {...parentProps} />
  ),
  (parentProps: AlertConfigDialogPresenterProps & MainDialogControl) => (
    <SimpleAlertConfigDialogStep3 {...parentProps} />
  )
];
