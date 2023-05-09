/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Exception from 'in-sap/Dashboards/tables/Exception';

export default function ExcepMetrics({ timeConfig, data: vm }) {
  return (
    <>
      <Exception
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName="ADM1823E_Transaction_Log_Held_by_an_Open_Transaction"
      />
      <Exception
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName="ADM1849C_LSN_Exhaustion"
      />
      <Exception
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName="Corrupt_page"
      />
      <Exception
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName="Disk_Error"
      />
      <Exception
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName="File_System_Full"
      />
      <Exception
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName="Maximum_Number_of_Objects_in_Tablespace"
      />
      <Exception
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName="Transaction_Log_Full"
      />
    </>
  );
}
