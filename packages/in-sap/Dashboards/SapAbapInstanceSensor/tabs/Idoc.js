/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import IdocOutboundMetrics from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/IdocOutboundList.tsx';
import IdocInboundMetrics from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/IdocInboundList.tsx';

export default function Idoc({ timeConfig, data: sap }) {
  const snapshotId = sap.id;
  return (
    <Fragment>
      <IdocInboundMetrics snapshotId={snapshotId} timeConfig={timeConfig} />
      <IdocOutboundMetrics snapshotId={snapshotId} timeConfig={timeConfig} />
    </Fragment>
  );
}
