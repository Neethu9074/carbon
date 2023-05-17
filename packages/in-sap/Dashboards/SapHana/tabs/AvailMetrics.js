/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Availability from 'in-sap/Dashboards/tables/Availability';

export default function AvailMetrics({ timeConfig, data: vm }) {
  return (
    <>
      <Availability
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName="Availability_of_Asynchronous_Table_Replication"
      />
      <Availability
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName="HDB_HOST_STATUS_METRIC_Database_Host_Status"
      />
    </>
  );
}
