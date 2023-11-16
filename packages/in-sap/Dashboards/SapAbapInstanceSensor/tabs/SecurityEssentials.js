/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import UserList from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/UserList.js';
import RFCCalls from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/RFCCalls.js';
import UserInfo from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/UserInfo.js';

export default function SecurityEssentials({ timeConfig, data: sap }) {
  const snapshotId = sap.id;
  return (
    <Fragment>
      <UserInfo snapshotId={snapshotId} />
      <UserList snapshotId={snapshotId} timeConfig={timeConfig} />
      <RFCCalls snapshotId={snapshotId} />
    </Fragment>
  );
}
