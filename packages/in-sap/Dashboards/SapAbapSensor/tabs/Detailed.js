/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import WorkProcessListMetric from 'in-sap/Dashboards/SapAbapSensor/tabs/WorkProcessListMetric.js';
import DBConnectionProvider from 'in-sap/Dashboards/SapAbapSensor/tabs/DBConnectionProvider.js';
import TotalMemory from 'in-sap/Dashboards/SapAbapSensor/tabs/TotalMemory.js';
import DumpStats from 'in-sap/Dashboards/SapAbapSensor/tabs/DumpStats';

export default function Detailed({ timeConfig, data: sap }) {
  const snapshotId = sap.id;
  return (
    <Fragment>
      <WorkProcessListMetric snapshotId={snapshotId} timeConfig={timeConfig} />
      <TotalMemory snapshotId={snapshotId} timeConfig={timeConfig} />
      <DBConnectionProvider snapshotId={snapshotId} />
      <DumpStats snapshotId={snapshotId} />
    </Fragment>
  );
}
