/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import SimpleAlertConfigDialogStep3 from 'in-alerting/smart-alerts/components/smart-alert-dialog/simple/SimpleAlertConfigDialogStep3';
import SimpleAlertConfigDialogStep1 from 'in-alerting/smart-alerts/websites/simple/SimpleAlertConfigDialogStep1';
import SimpleAlertConfigDialogStep2 from 'in-alerting/smart-alerts/websites/simple/SimpleAlertConfigDialogStep2';
import { websitesAlertingStepSwitch } from 'in-alerting/smart-alerts/websites/tracker';
import { t } from 'in-i18n';

export const stepConfigs = [
  {
    title: t('in-alerting:smartAlerts.websites.simple.stepConfigsStep1Title'),
    validateIntermediately: [['rule', 'value']]
  },
  {
    title: t('in-alerting:smartAlerts.websites.simple.stepConfigsStep2Title')
  },
  {
    title: t('in-alerting:smartAlerts.websites.simple.stepConfigsStep3Title'),
    validateIntermediately: [['alertChannelIds']]
  }
];

export const stepRenderers = [
  parentProps => <SimpleAlertConfigDialogStep1 setJsErrorsListVisible={parentProps.setSliderState} {...parentProps} />,
  parentProps => <SimpleAlertConfigDialogStep2 {...parentProps} />,
  parentProps => <SimpleAlertConfigDialogStep3 {...parentProps} />
];

export const onStepChanged = (oldStep, nextStep) => websitesAlertingStepSwitch({ oldStep, nextStep });
