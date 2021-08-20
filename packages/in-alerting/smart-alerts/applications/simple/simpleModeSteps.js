/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { isEmpty } from 'lodash';
import React from 'react';

import SimpleAlertConfigDialogStep3 from 'in-alerting/smart-alerts/components/smart-alert-dialog/simple/SimpleAlertConfigDialogStep3';
import SimpleAlertConfigDialogStep2 from 'in-alerting/smart-alerts/applications/simple/SimpleAlertConfigDialogStep2';
import SimpleAlertConfigDialogStep1 from 'in-alerting/smart-alerts/applications/simple/SimpleAlertConfigDialogStep1';
import { applicationsAlertingStepSwitch as trackStepSwitch } from 'in-alerting/smart-alerts/applications/tracker';
import { getEntitySelection } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { applicationId as applicationIdMatrixParam } from 'in-applications/navigation/matrix';
import { applicationDashboard } from 'in-applications/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { t } from 'in-i18n';

export const stepConfigs = [
  {
    title: t('in-alerting:smartAlerts.applications.simple.step1Title'),
    validateIntermediately: [
      ['rule', 'message'],
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
  parentProps => <SimpleAlertConfigDialogStep3 {...parentProps} />
];

export const onStepChanged = (form, updateForm, location) => getOnStepSwitch({ form, updateForm, location });

function getOnStepSwitch({ form, updateForm, location }) {
  return (oldStep, nextStep) => {
    if (nextStep === 0) {
      const applications = form.get('applications').value;
      if (isEmpty(applications)) {
        const applicationId = getMatrixParameter(location, applicationDashboard, applicationIdMatrixParam);
        updateForm(form.updateIn(['applications'], f => f.setValue(getEntitySelection(applicationId))));
      }
    }

    trackStepSwitch({ oldStep, nextStep });
  };
}
