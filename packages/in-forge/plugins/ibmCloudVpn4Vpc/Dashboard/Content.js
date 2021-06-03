/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import ConnectionsTable from 'in-forge/plugins/ibmCloudVpn4Vpc/Dashboard/ConnectionsTable';
import GatewayTable from 'in-forge/plugins/ibmCloudVpn4Vpc/Dashboard/GatewayTable';

export default function IbmCloudVpn4VpcDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <GatewayTable snapshot={snapshot} timeConfig={timeConfig} />
      <ConnectionsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
