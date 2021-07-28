/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import AlertConfigDialogPresenter from 'in-alerting/smart-alerts/components/smart-alert-dialog/AlertConfigDialogPresenter';
import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/applications/Dialog/SmartAlertConfigDialogWrapper';
import { generateAlertConfig } from 'in-alerting/smart-alerts/applications/components/CreateSmartAlert';

export default {
  title: 'Templates|applications/alerting/AlertConfigDialog',
  component: AlertConfigDialogPresenter,
  parameters: {
    chromatic: { disable: true }
  }
};

export const AdvancedAlertConfigDialog = () => {
  const { applicationId = 'applicationId' } = {};

  return (
    <SmartAlertConfigDialogWrapper
      applicationLabel={'applicationLabel'}
      alertConfig={generateAlertConfig({
        applicationId,
        boundaryScope: 'urlBoundaryScope'
      })}
      editMode
      startWithSimpleMode
    />
  );
};
