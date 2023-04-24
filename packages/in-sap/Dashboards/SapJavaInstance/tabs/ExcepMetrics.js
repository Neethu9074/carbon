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
        configurationName={'JAVA INSTANCE'}
      />
    </Fragment>
  );
}
