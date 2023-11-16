/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import IdocControlRecord from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/IdocControlRecord.js';
import IdocStatusRecord from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/IdocStatusRecord.js';
import IdocDataRecord from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/IdocDataRecord.js';

export default function Idoc({ data: sap }) {
  const snapshotId = sap.id;
  return (
    <Fragment>
      <IdocControlRecord snapshotId={snapshotId} />
      <IdocDataRecord snapshotId={snapshotId} />
      <IdocStatusRecord snapshotId={snapshotId} />
    </Fragment>
  );
}
