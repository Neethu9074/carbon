/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import LogMessagesTable from 'in-logging/components/Dashboards/components/LogMessagesTable';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getApplication from 'in-applications/subscriptions/getApplication';
import Footer from 'in-components/Footer';
import { Result } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { ApplicationTabProps } from 'in-applications/Dashboards/application/types';
import { just } from '@instana/observables';

export default function LogMessages({
  boundaryScope: urlBoundaryScope,
  data: application,
  ...props
}: ApplicationTabProps) {
  const { serviceId, applicationId, endpointId } = props;
  const applicationName = useObservable(applicationId ? getApplication({ id: applicationId }).map(getLabel) : just(null), []);
  const serviceName = useObservable(serviceId ? getServiceLabel({ id: serviceId }).map(getLabel) : just(null), []);
  const endpointName = useObservable(endpointId ? getEndpointInfo({ id: endpointId }).map(getLabel) : just(null), []);

  const boundaryScope = urlBoundaryScope || application.boundaryScope;

  return (
    <Fragment>
      <LogMessagesTable
        boundaryScope={boundaryScope}
        applicationName={applicationName}
        serviceName={serviceName}
        endpointName={endpointName}
        {...props}
      />
      <Footer />
    </Fragment>
  );
}

function getLabel(result: Result<unknown>) {
  return get(result, ['data', 'label'], null);
}
