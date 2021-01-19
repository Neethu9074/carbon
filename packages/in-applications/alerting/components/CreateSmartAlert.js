/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { just } from '@instana/observables';
import PropTypes from 'prop-types';
import React from 'react';

import SmartAlertConfigDialogWrapper from 'in-applications/alerting/Dialog/SmartAlertConfigDialogWrapper';
import FloatingActionButton from 'in-new-components/FloatingActionButton/FloatingActionButton';
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
  endpointLabel,
  location,
  serviceLabel
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
              applicationId,
              serviceLabel,
              endpointLabel,
              boundaryScope: urlBoundaryScope || defaultBoundaryScope
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
    tagFilterExpression: getTagFilterExpression(serviceLabel, endpointLabel)
  };
}

function getLabel(result) {
  return result?.data?.label ?? null;
}

function getTagFilterExpression(serviceLabel, endpointLabel) {
  const elements = [];

  if (serviceLabel) {
    elements.push(getFilter('service.name', serviceLabel));
  }

  if (endpointLabel) {
    elements.push(getFilter('endpoint.name', endpointLabel));
  }

  if (elements.length === 1) {
    return elements[0];
  }

  return {
    type: 'EXPRESSION',
    logicalOperator: 'AND',
    elements
  };
}

const getFilter = (name, value) => ({
  type: 'TAG_FILTER',
  name,
  operator: 'EQUALS',
  value,
  entity: 'DESTINATION'
});
