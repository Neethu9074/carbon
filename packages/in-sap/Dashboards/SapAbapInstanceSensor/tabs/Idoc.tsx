/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Fragment } from 'react';

import IdocOutboundMetrics from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/IdocOutboundList';
import IdocInboundMetrics from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/IdocInboundList';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function Idoc({ data }: { data: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = data.id;
  return (
    <Fragment>
      <IdocInboundMetrics snapshotId={snapshotId} timeConfig={timeConfig} />
      <IdocOutboundMetrics snapshotId={snapshotId} timeConfig={timeConfig} />
    </Fragment>
  );
}
