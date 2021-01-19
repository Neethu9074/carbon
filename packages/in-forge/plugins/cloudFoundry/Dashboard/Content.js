/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ApplicationsTable from 'in-forge/plugins/cloudFoundry/Dashboard/ApplicationsTable';
import DiegoTable from 'in-forge/plugins/cloudFoundry/Dashboard/DiegoTable';
import DopplerTable from 'in-forge/plugins/cloudFoundry/Dashboard/DopplerTable';
import DEATable from 'in-forge/plugins/cloudFoundry/Dashboard/DEATable';
import CloudControllerTable from 'in-forge/plugins/cloudFoundry/Dashboard/CloudControllerTable';
import HealthManagerTable from 'in-forge/plugins/cloudFoundry/Dashboard/HealthManagerTable';

export default function CloudFoundryDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <ApplicationsTable snapshot={snapshot} timeConfig={timeConfig} />

      <DiegoTable snapshot={snapshot} timeConfig={timeConfig} />

      <DopplerTable snapshot={snapshot} timeConfig={timeConfig} />

      <DEATable snapshot={snapshot} timeConfig={timeConfig} />

      <CloudControllerTable snapshot={snapshot} timeConfig={timeConfig} />

      <HealthManagerTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
