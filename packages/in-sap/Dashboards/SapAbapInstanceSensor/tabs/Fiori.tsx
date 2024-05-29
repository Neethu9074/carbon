/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Fragment } from 'react';

import GatewayConnections from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/GatewayConnections';
import FrontEndErrorLogs from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/FrontEndErrorLogs';
import BackEndErrorLogs from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/BackEndErrorLogs';
import FioriCallMetric from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/FioriCallMetric';
import FioriPageVisit from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/FioriPageVisit';
import GatewayStats from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/GatewayStats';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function Fiori({ data }: { data: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = data.id;
  return (
    <Fragment>
      <FioriCallMetric snapshotId={snapshotId} timeConfig={timeConfig} />
      <FioriPageVisit snapshotId={snapshotId} timeConfig={timeConfig} />
      <GatewayConnections snapshotId={snapshotId} />
      <GatewayStats snapshotId={snapshotId} />
      <FrontEndErrorLogs snapshotId={snapshotId} timeConfig={timeConfig} />
      <BackEndErrorLogs snapshotId={snapshotId} timeConfig={timeConfig} />
    </Fragment>
  );
}
