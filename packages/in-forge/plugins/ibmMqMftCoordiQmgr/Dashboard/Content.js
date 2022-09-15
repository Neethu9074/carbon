/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import FileTransferStatusTable from 'in-forge/plugins/ibmMqMftCoordiQmgr/Dashboard/FileTransferStatusTable';
import FileTransferLogsTable from 'in-forge/plugins/ibmMqMftCoordiQmgr/Dashboard/FileTransferLogsTable';
import AgentsTable from 'in-forge/plugins/ibmMqMftCoordiQmgr/Dashboard/AgentsTable';

export default function IbmMqMftCoordiQmgrDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <AgentsTable snapshot={snapshot} timeConfig={timeConfig} />
      <FileTransferStatusTable snapshot={snapshot} timeConfig={timeConfig} />
      <FileTransferLogsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
