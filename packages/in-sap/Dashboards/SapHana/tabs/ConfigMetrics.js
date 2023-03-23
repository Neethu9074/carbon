/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import Configuration from 'in-sap/Dashboards/tables/Configuration';

export default function ConfigMetrics({ timeConfig, data: vm }) {
  return (
    <Fragment>
      <Configuration
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'Trace_Settings'}
      />
    </Fragment>
  );
}
