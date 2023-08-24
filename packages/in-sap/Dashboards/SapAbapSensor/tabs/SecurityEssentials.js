/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import UserList from 'in-sap/Dashboards/SapAbapSensor/tabs/UserList.js';
import RFCCalls from 'in-sap/Dashboards/SapAbapSensor/tabs/RFCCalls.js';

export default function SecurityEssentials({ data: sap }) {
  const snapshotId = sap.id;
  return (
    <Fragment>
      <UserList snapshotId={snapshotId} />
      <RFCCalls snapshotId={snapshotId} />
    </Fragment>
  );
}
