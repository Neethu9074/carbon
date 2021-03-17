/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/applications/Dialog/SmartAlertConfigDialogWrapper';
import { getEntitySelection } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { applicationsAlertingAddAlert } from 'in-alerting/smart-alerts/applications/tracker';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { propTypeLocation } from 'in-stores/navigation';
import { reload } from 'in-settings/components/List';
import Button from 'in-new-components/Button';
import { t } from 'in-i18n';

export default function CreateGlobalSmartAlertButton({
  boundaryScope: urlBoundaryScope,
  defaultBoundaryScope,
  includeSynthetic,
  location
}) {
  if (location?.pathname.includes('/application/configuration')) {
    // hide button on the config page
    return null;
  }

  return (
    <Button
      icon="lib_alerts_create"
      kind="primaryv2"
      onClick={() => {
        addActiveDialog(
          <SmartAlertConfigDialogWrapper
            isGlobalSmartAlert
            formData={generateFormData({
              boundaryScope: urlBoundaryScope || defaultBoundaryScope,
              includeSynthetic
            })}
            onClose={() => {
              close();
              if (location?.pathname?.includes('/application/alerts')) {
                /* TODO adapt/refine url for global SA */
                reload();
              }
            }}
          />
        );
        applicationsAlertingAddAlert(location?.pathname, 'global');
      }}
      withBoxShadow
    >
      {t('in-alerting:smartAlerts.applications.newGlobalAlert')}
    </Button>
  );
}

CreateGlobalSmartAlertButton.propTypes = {
  location: propTypeLocation,
  boundaryScope: PropTypes.string,
  defaultBoundaryScope: PropTypes.string,
  includeSynthetic: PropTypes.bool
};

export function generateFormData({ boundaryScope, applicationId, serviceId, endpointId, includeSynthetic }) {
  return {
    applicationId /* TODO adapt/refine url for global SA */,
    boundaryScope,
    rule: {
      alertType: 'slowness',
      operator: 'EQUALS',
      metricName: 'latency'
    },
    threshold: {
      type: 'historicBaseline',
      value: 0.0,
      seasonality: 'DAILY'
    },
    calculateThresholdOnBackend: true,
    includeSynthetic,
    applications: getEntitySelection(applicationId, serviceId, endpointId)
  };
}
