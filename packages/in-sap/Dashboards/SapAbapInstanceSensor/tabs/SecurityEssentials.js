/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import HttpMetricsStats from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/HttpMetricsStats';
import UserList from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/UserList';
import RFCCalls from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/RFCCalls';
import UserInfo from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/UserInfo';

export default function SecurityEssentials({ timeConfig, data: sap }) {
  const snapshotId = sap.id;
  return (
    <Fragment>
      <UserInfo snapshotId={snapshotId} timeConfig={timeConfig} />
      <UserList snapshotId={snapshotId} timeConfig={timeConfig} />
      <RFCCalls snapshotId={snapshotId} />
      <HttpMetricsStats snapshotId={snapshotId} timeConfig={timeConfig} />
    </Fragment>
  );
}
