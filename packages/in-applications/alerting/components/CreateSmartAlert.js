/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { just } from '@instana/observables';
import PropTypes from 'prop-types';
import React from 'react';

import SmartAlertConfigDialogWrapper from 'in-applications/alerting/Dialog/SmartAlertConfigDialogWrapper';
import FloatingActionButton from 'in-new-components/FloatingActionButton/FloatingActionButton';
import { getEntitySelection } from 'in-applications/alerting/data/entitySelection';
import { applicationsAlertingAddAlert } from 'in-applications/alerting/tracker';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import { propTypeLocation } from 'in-stores/navigation/navigation';
import { reload } from 'in-settings/components/List';
import { isBlank } from 'in-services/util/string';
import connectTo from 'in-hoc/connectTo';

export default connectTo(({ applicationLabel, applicationId, serviceId, endpointId }) => {
  const observables = {};

  observables.applicationLabel =
    !applicationLabel && applicationId ? getApplication({ id: applicationId }).map(getLabel) : just(applicationLabel);

  if (serviceId) {
    observables.serviceLabel = getServiceLabel({ id: serviceId }).map(getLabel);
  }
  if (endpointId) {
    observables.endpointLabel = getEndpointInfo({ id: endpointId }).map(getLabel);
  }
  return observables;
})(CreateSmartAlert);

function CreateSmartAlert({
  applicationId,
  applicationLabel,
  boundaryScope: urlBoundaryScope,
  defaultBoundaryScope,
  serviceId,
  serviceLabel,
  endpointId,
  endpointLabel,
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
            applicationLabel={applicationLabel}
            formData={generateFormData({
              boundaryScope: urlBoundaryScope || defaultBoundaryScope,
              applicationId,
              serviceId,
              serviceLabel,
              endpointId,
              endpointLabel
            })}
            onClose={() => {
              close();
              if (location.pathname.includes('/application/alerts')) {
                reload();
              }
            }}
          />
        );
        applicationsAlertingAddAlert(location.pathname, applicationLabel);
      }}
      withBoxShadow
    >
      Add Alert
    </FloatingActionButton>
  );
}

CreateSmartAlert.propTypes = {
  applicationId: PropTypes.string,
  applicationLabel: PropTypes.string,
  serviceId: PropTypes.string,
  serviceLabel: PropTypes.string,
  endpointId: PropTypes.string,
  endpointLabel: PropTypes.string,
  location: propTypeLocation.isRequired,
  boundaryScope: PropTypes.string,
  defaultBoundaryScope: PropTypes.string
};

export function generateFormData({ boundaryScope, applicationId, serviceId, serviceLabel, endpointId, endpointLabel }) {
  return {
    applicationId,
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
    // QB1
    tagFilters: [
      {
        name: 'service.name',
        operator: 'EQUALS',
        stringValue: serviceLabel
      },
      {
        name: 'endpoint.name',
        operator: 'EQUALS',
        stringValue: endpointLabel
      }
    ].filter(({ stringValue }) => Boolean(stringValue)),
    // QB2
    applications: getEntitySelection(applicationId, serviceId, endpointId)
  };
}

function getLabel(result) {
  return result?.data?.label ?? null;
}
