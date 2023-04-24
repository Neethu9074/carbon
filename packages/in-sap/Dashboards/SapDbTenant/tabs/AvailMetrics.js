/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import Availability from 'in-sap/Dashboards/tables/Availability';

export default function AvailMetrics({ timeConfig, data: vm }) {
  return (
    <Fragment>
      <Availability
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'DB_Instance_Status'}
      />
      <Availability
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'HDB_Service_Availability_Inst_Via_DA'}
      />
      <Availability
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'Inactive_Services'}
      />
      <Availability
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'Restarted_Services'}
      />
      <Availability
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'Services_Status'}
      />
    </Fragment>
  );
}
