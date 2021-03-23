/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { just } from '@instana/observables';
import PropTypes from 'prop-types';
import React from 'react';

import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/applications/Dialog/SmartAlertConfigDialogWrapper';
import { getEntitySelection } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { applicationsAlertingAddAlert } from 'in-alerting/smart-alerts/applications/tracker';
import { refreshSmartAlertConfigsList } from '../inventory/SmartAlertsBaseList';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import FloatingActionButton from 'in-new-components/FloatingActionButton';
import getApplication from 'in-subscription/application/getApplication';
import { propTypeLocation } from 'in-stores/navigation';
import { reload } from 'in-settings/components/List';
import { isBlank } from 'in-services/util/string';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(({ applicationLabel, applicationId }) => {
  const observables = {};
  observables.applicationLabel =
    !applicationLabel && applicationId ? getApplication({ id: applicationId }).map(getLabel) : just(applicationLabel);
  return observables;
})(CreateSmartAlert);

function CreateSmartAlert({
  applicationId,
  applicationLabel,
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

  if (isBlank(applicationId) || isBlank(applicationLabel)) {
    return null;
  }

  return (
    <FloatingActionButton
      iconType="lib_alerts_create"
      onClick={() => {
        addActiveDialog(
          <SmartAlertConfigDialogWrapper
            applicationLabel={applicationLabel /* figure out if this information is still helpful */}
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
          />
        );
        applicationsAlertingAddAlert(location.pathname, applicationLabel);
      }}
      withBoxShadow
    >
      {t('in-alerting:smartAlerts.applications.components.createSmartAlert')}
    </FloatingActionButton>
  );
}

CreateSmartAlert.propTypes = {
  applicationId: PropTypes.string,
  applicationLabel: PropTypes.string,
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
      type: 'historicBaseline',
      value: 0.0,
      seasonality: 'DAILY'
    },
    calculateThresholdOnBackend: true,
    includeSynthetic,
    applications: getEntitySelection(applicationId, serviceId, endpointId)
  };
}

function getLabel(result) {
  return result?.data?.label ?? null;
}
