/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Fragment } from 'react';

import { ApplicationBoundaryScope, TimeConfig } from 'in-types';
import RootCauseErrorMessagesTable from './RootCauseErrorTable';
import RootCauseLogMessagesTable from './RootCauseLogTable';

interface RootCauseDashboardProps {
  applicationBoundaryScope: ApplicationBoundaryScope;
  serviceId?: string;
  serviceName: any;
  endpointId?: string;
  endpointName: any;
  applicationId?: string;
  applicationName: any;
  timeConfig: TimeConfig;
}

export default function RootCauseDashboard({
  applicationBoundaryScope,
  applicationId,
  applicationName,
  serviceId,
  serviceName,
  endpointId,
  endpointName,
  timeConfig
}: RootCauseDashboardProps) {
  return (
    <Fragment>
      <RootCauseErrorMessagesTable
        boundaryScope={applicationBoundaryScope}
        applicationId={applicationId}
        applicationName={applicationName}
        serviceId={serviceId}
        serviceName={serviceName}
        endpointId={endpointId}
        endpointName={endpointName}
        timeConfig={timeConfig}
      />
      <RootCauseLogMessagesTable
        boundaryScope={applicationBoundaryScope}
        applicationId={applicationId}
        applicationName={applicationName}
        serviceId={serviceId}
        serviceName={serviceName}
        endpointId={endpointId}
        endpointName={endpointName}
        timeConfig={timeConfig}
      />
    </Fragment>
  );
}
