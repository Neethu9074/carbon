/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import SimpleAlertConfigDialogStep2 from 'in-alerting/smart-alerts/applications/dialog/simple/SimpleAlertConfigDialogStep2';
import SimpleAlertConfigDialogStep1 from 'in-alerting/smart-alerts/applications/dialog/simple/SimpleAlertConfigDialogStep1';
import SimpleAlertConfigDialogStep3 from 'in-alerting/smart-alerts/components/dialog/simple/SimpleAlertConfigDialogStep3';
import { alertChannelPerSeverityApplicationSaEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export const stepConfigs = [
  {
    title: t('in-alerting:smartAlerts.applications.simple.step1Title'),
    validateIntermediately: [
      ['rule', 'message'],
      ['rule', 'statusCode'], // fail when from > to (comparison)
      ['rule', 'statusCode', 'statusCodeStart'], // fail on empty start field
      ['rule', 'statusCode', 'statusCodeEnd'], // fail on empty end field
      ['rule', 'level']
    ]
  },
  {
    title: t('in-alerting:smartAlerts.applications.simple.step2Title'),
    validateIntermediately: [['applications']]
  },
  {
    title: t('in-alerting:smartAlerts.applications.simple.step3Title'),
    validateIntermediately: [['alertChannelIds']]
  }
];

export const stepRenderers = [
  parentProps => (
    <SimpleAlertConfigDialogStep1 setLogMessagesListVisible={parentProps.setSliderState} {...parentProps} />
  ),
  parentProps => <SimpleAlertConfigDialogStep2 {...parentProps} />,
  parentProps => (
    <SimpleAlertConfigDialogStep3
      {...parentProps}
      alertChannelPerSeverityEnabled={alertChannelPerSeverityApplicationSaEnabled}
    />
  )
];
