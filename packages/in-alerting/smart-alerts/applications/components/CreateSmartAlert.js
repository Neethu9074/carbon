/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/applications/components/list/SmartAlertsBaseList';
import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/applications/Dialog/SmartAlertConfigDialogWrapper';
import { getEntitySelection } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { applicationsAlertingAddAlert } from 'in-alerting/smart-alerts/applications/tracker';
import { HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import FloatingActionButton from 'in-components/FloatingActionButton';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { propTypeLocation } from 'in-stores/navigation';
import { reload } from 'in-settings/components/List';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export default function CreateSmartAlert({
  applicationId,
  boundaryScope: urlBoundaryScope,
  defaultBoundaryScope,
  includeSynthetic,
  serviceId,
  endpointId,
  location
}) {
  if (location.pathname.includes('/application/configuration')) {
    return null;
  }

  if (isBlank(applicationId)) {
    return null;
  }

  return (
    <FloatingActionButton
      icon="lib_alerts_create"
      onClick={() => {
        addActiveDialog(
          <SmartAlertConfigDialogWrapper
            formData={generateFormData({
              boundaryScope: urlBoundaryScope || defaultBoundaryScope,
              applicationId,
              serviceId,
              endpointId,
              includeSynthetic
            })}
            onClose={() => {
              close();
              if (location.pathname.includes('/application/alerts')) {
                reload();
                refreshSmartAlertConfigsList();
              }
            }}
            startWithSimpleMode
          />
        );
        applicationsAlertingAddAlert(location.pathname);
      }}
      withBoxShadow
    >
      {t('in-alerting:smartAlerts.applications.components.createSmartAlert')}
    </FloatingActionButton>
  );
}

CreateSmartAlert.propTypes = {
  applicationId: PropTypes.string,
  serviceId: PropTypes.string,
  endpointId: PropTypes.string,
  location: propTypeLocation.isRequired,
  boundaryScope: PropTypes.string,
  defaultBoundaryScope: PropTypes.string,
  includeSynthetic: PropTypes.bool
};

export function generateFormData({ boundaryScope, applicationId, serviceId, endpointId, includeSynthetic }) {
  return {
    boundaryScope,
    rule: {
      alertType: 'slowness',
      operator: 'EQUALS',
      metricName: 'latency'
    },
    threshold: {
      type: HISTORIC_BASELINE,
      value: 0.0,
      seasonality: DAILY
    },
    calculateThresholdOnBackend: true,
    includeSynthetic,
    applications: getEntitySelection(applicationId, serviceId, endpointId)
  };
}
