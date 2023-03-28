/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import Performance from 'in-sap/Dashboards/tables/Performance';

export default function PerfMetrics({ timeConfig, data: vm }) {
  return (
    <Fragment>
      <Performance
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'Delta_Merge_Duration'}
      />
      <Performance
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'High_number_of_threads_waiting_for_locks'}
      />
      <Performance
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'MVCC_Versions'}
      />
    </Fragment>
  );
}
