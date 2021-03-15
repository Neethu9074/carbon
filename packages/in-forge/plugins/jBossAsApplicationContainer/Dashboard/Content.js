/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import UndertowStatsEnabledNotification from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/UndertowStatsEnabledNotification';
import ConnectionPoolsTable from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/ConnectionPoolsTable';
import EjbDeploymentsTable from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/EjbDeploymentsTable';
import WebDeploymentsTable from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/WebDeploymentsTable';
import DatasourcesTable from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/DatasourcesTable';
import ThreadPoolsTable from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/ThreadPoolsTable';
import ConnectorsTable from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/ConnectorsTable';

export default function JBossAsDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <UndertowStatsEnabledNotification snapshot={snapshot} />
      <WebDeploymentsTable snapshot={snapshot} timeConfig={timeConfig} />
      <EjbDeploymentsTable snapshot={snapshot} timeConfig={timeConfig} />
      <ConnectorsTable snapshot={snapshot} timeConfig={timeConfig} />
      <DatasourcesTable snapshot={snapshot} timeConfig={timeConfig} />
      <ConnectionPoolsTable snapshot={snapshot} timeConfig={timeConfig} />
      <ThreadPoolsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
