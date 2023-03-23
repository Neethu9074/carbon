/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import Exception from 'in-sap/Dashboards/tables/Exception';

export default function ExcepMetrics({ timeConfig, data: vm }) {
  return (
    <Fragment>
      <Exception
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'Instance_Exceptions'}
      />
      <Exception
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'ABAP_Short_Dumps'}
      />
      <Exception
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'High_number_of_ABAP_system_log_messages'}
      />
      <Exception
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'High_number_of_ABAP_System_Log_Messages'}
      />
    </Fragment>
  );
}
