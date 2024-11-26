/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Fragment, useState } from 'react';

import { ButtonGroup } from '@instana/components';

import RootCauseErrorMessagesTable from './RootCauseErrorTable';
import { ApplicationBoundaryScope, TimeConfig } from 'in-types';
import RootCauseLogMessagesTable from './RootCauseLogTable';
import { t } from 'in-i18n';

interface RootCauseContextDashboardProps {
  applicationBoundaryScope: ApplicationBoundaryScope;
  serviceId?: string;
  serviceName: any;
  endpointId?: string;
  endpointName: any;
  applicationId?: string;
  applicationName: any;
  timeConfig: TimeConfig;
}

export default function RootCauseContextDashboard({
  applicationBoundaryScope,
  applicationId,
  applicationName,
  serviceId,
  serviceName,
  endpointId,
  endpointName,
  timeConfig
}: RootCauseContextDashboardProps) {
  const [configsCategory, setConfigsCategory] = useState('errorMessages');
  const leftHeaderContent = (
    <ButtonGroup
      segmented
      buttonPropsList={[
        {
          text: t('in-events:RCA.errorMessages'),
          key: 'errorMessages',
          onClick() {
            setConfigsCategory('errorMessages');
          }
        },
        {
          text: t('in-events:RCA.traceLogs'),
          key: 'traceLogs',
          onClick() {
            setConfigsCategory('traceLogs');
          }
        }
      ]}
      activeKey={(configsCategory as string) || 'traceLogs'}
    />
  );
  return (
    <Fragment>
      {configsCategory === 'errorMessages' && (
        <RootCauseErrorMessagesTable
          boundaryScope={applicationBoundaryScope}
          applicationId={applicationId}
          applicationName={applicationName}
          serviceId={serviceId}
          serviceName={serviceName}
          endpointId={endpointId}
          endpointName={endpointName}
          timeConfig={timeConfig}
          cardTitle={leftHeaderContent}
        />
      )}
      {configsCategory === 'traceLogs' && (
        <RootCauseLogMessagesTable
          boundaryScope={applicationBoundaryScope}
          applicationId={applicationId}
          applicationName={applicationName}
          serviceId={serviceId}
          serviceName={serviceName}
          endpointId={endpointId}
          endpointName={endpointName}
          timeConfig={timeConfig}
          cardTitle={leftHeaderContent}
        />
      )}
    </Fragment>
  );
}
