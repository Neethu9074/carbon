/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import ProcessListTable from './ProcessList';

export default function processGroupDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <ProcessListTable snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
}
