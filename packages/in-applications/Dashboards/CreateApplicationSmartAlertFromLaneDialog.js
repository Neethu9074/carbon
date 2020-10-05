import { just } from 'reactive-observables';
import React from 'react';

import SmartAlertConfigDialogWrapper from 'in-applications/alerting/Dialog/SmartAlertConfigDialogWrapper';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import getApplication from 'in-subscription/application/getApplication';
import { close } from 'in-components/DialogPresenter/store';
import useObservable from 'in-hooks/useObservable';

export default function CreateApplicationSmartAlert({
  applicationLabel,
  applicationId,
  serviceId,
  endpointId,
  boundaryScope
}) {
  const appLabel = useObservable(
    applicationId && !applicationLabel ? getApplication({ id: applicationId }).map(getLabel) : just(applicationLabel),
    [applicationId]
  );

  let serviceLabel;
  if (serviceId) {
    serviceLabel = getServiceLabel({ id: serviceId }).map(getLabel);
  }

  let endpointLabel;
  if (endpointId) {
    endpointLabel = getEndpointInfo({ id: endpointId }).map(getLabel);
  }

  return (
    <SmartAlertConfigDialogWrapper
      applicationLabel={appLabel}
      formData={generateFormData({ applicationId, serviceLabel, endpointLabel, boundaryScope })}
      onClose={close}
    />
  );
}

export function generateFormData({ applicationId, serviceLabel, endpointLabel, boundaryScope }) {
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
