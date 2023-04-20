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
        configurationName={'System_Performance'}
      />
    </Fragment>
  );
}
