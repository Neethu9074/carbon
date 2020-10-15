import { just } from 'reactive-observables';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import SmartAlertConfigDialogWrapper from 'in-applications/alerting/Dialog/SmartAlertConfigDialogWrapper';
import FloatingActionButton from 'in-new-components/FloatingActionButton/FloatingActionButton';
import { applicationsAlertingAddAlert } from 'in-applications/alerting/tracker';
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
  endpointLabel,
  location,
  serviceLabel
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  if (location.pathname.includes('/application/configuration')) {
    return null;
  }

  if (isBlank(applicationId) || isBlank(applicationLabel)) {
    return null;
  }

  return (
    <>
      <FloatingActionButton
        iconType="lib_alerts_create"
        onClick={() => {
          setDialogOpen(true);
          applicationsAlertingAddAlert(location.pathname, applicationLabel);
        }}
        withBoxShadow
      >
        Add Alert
      </FloatingActionButton>
      {dialogOpen && (
        <SmartAlertConfigDialogWrapper
          applicationLabel={applicationLabel}
          formData={generateFormData({
            applicationId,
            serviceLabel,
            endpointLabel,
            boundaryScope: urlBoundaryScope || defaultBoundaryScope
          })}
          onClose={() => {
            setDialogOpen(false);
            if (location.pathname.includes('/application/alerts')) {
              reload();
            }
          }}
        />
      )}
    </>
  );
}

CreateSmartAlert.propTypes = {
  applicationId: PropTypes.string,
  applicationLabel: PropTypes.string,
  endpointLabel: PropTypes.string,
  location: propTypeLocation.isRequired,
  serviceLabel: PropTypes.string,
  boundaryScope: PropTypes.string,
  defaultBoundaryScope: PropTypes.string
};

function generateFormData({ applicationId, serviceLabel, endpointLabel, boundaryScope }) {
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
    calculateThresholdOnBackend: true
  };
}

function getLabel(result) {
  return result?.data?.label ?? null;
}
