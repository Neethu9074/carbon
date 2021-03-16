/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ApplicationsTable from 'in-forge/plugins/mule/Dashboard/ApplicationsTable.js';
import FlowsTable from 'in-forge/plugins/mule/Dashboard/FlowsTable.js';

export default function MuleDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <ApplicationsTable snapshot={snapshot} timeConfig={timeConfig} />
      <FlowsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
