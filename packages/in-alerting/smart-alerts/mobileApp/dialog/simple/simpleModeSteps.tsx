/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

//@ts-expect-error need ts migration
import SimpleAlertConfigDialogStep1 from 'in-alerting/smart-alerts/mobileApp/dialog/simple/SimpleAlertConfigDialogStep1';
import {
  AlertConfigDialogPresenterProps,
  MainDialogControl
} from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import SimpleAlertConfigDialogStep3 from 'in-alerting/smart-alerts/components/dialog/simple/SimpleAlertConfigDialogStep3';
import { t } from 'in-i18n';

export const stepConfigs = [
  {
    title: t('in-alerting:smartAlerts.mobileApp.simple.stepConfigsStep1Title')
  },
  {
    title: t('in-alerting:smartAlerts.mobileApp.simple.stepConfigsStep3Title')
  }
];

export const stepRenderers = [
  (parentProps: AlertConfigDialogPresenterProps & MainDialogControl) => {
    return <SimpleAlertConfigDialogStep1 {...parentProps} />;
  },
  (parentProps: AlertConfigDialogPresenterProps & MainDialogControl) => (
    <SimpleAlertConfigDialogStep3 {...parentProps} />
  )
];
