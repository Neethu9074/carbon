/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import SmartAlertConfigDialogWrapper from 'in-applications/alerting/Dialog/SmartAlertConfigDialogWrapper';
import AlertConfigDialogPresenter from 'in-new-components/Alerting/AlertConfigDialogPresenter';
import { generateFormData } from 'in-applications/alerting/components/CreateSmartAlert';

export default {
  title: 'Templates|applications/alerting/AlertConfigDialog',
  component: AlertConfigDialogPresenter,
  parameters: {
    chromatic: { disable: true }
  }
};

export const AdvancedAlertConfigDialog = () => {
  const { serviceLabel = 'serviceLabel', endpointLabel = 'endpointLabel', applicationId = 'applicationId' } = {};

  return (
    <SmartAlertConfigDialogWrapper
      applicationLabel={'applicationLabel'}
      formData={generateFormData({
        applicationId,
        serviceLabel,
        endpointLabel,
        boundaryScope: 'urlBoundaryScope'
      })}
      editMode
    />
  );
};
