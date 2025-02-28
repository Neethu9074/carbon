/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import { useObservable } from '@instana/hooks';

import ErrorMessagesTable from 'in-applications/Dashboards/commonTabs/messages/components/ErrorMessagesTable';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getApplication from 'in-applications/subscriptions/getApplication';
import Footer from 'in-components/Footer/Footer';

export default function ErrorMessages({
  boundaryScope: urlBoundaryScope,
  data: application,
  applicationId,
  serviceId,
  endpointId,
  timeConfig
}) {
  const applicationName = useObservable(applicationId ? getApplication({ id: applicationId }).map(getLabel) : null, [
    applicationId
  ]);
  const serviceName = useObservable(serviceId ? getServiceLabel({ id: serviceId }).map(getLabel) : null, [serviceId]);
  const endpointName = useObservable(endpointId ? getEndpointInfo({ id: endpointId }).map(getLabel) : null, [
    endpointId
  ]);
  const boundaryScope = urlBoundaryScope || application.boundaryScope;

  return (
    <Fragment>
      <ErrorMessagesTable
        applicationId={applicationId}
        applicationName={applicationName}
        boundaryScope={boundaryScope}
        endpointName={endpointName}
        endpointId={endpointId}
        serviceId={serviceId}
        serviceName={serviceName}
        timeConfig={timeConfig}
      />
      <Footer />
    </Fragment>
  );
}

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}
