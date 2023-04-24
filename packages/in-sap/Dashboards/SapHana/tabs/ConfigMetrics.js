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
        configurationName={'Discrepancy_between_host_server_times'}
      />
      <Configuration
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'Enablement_of_Automatic_Log_Backup'}
      />
      <Configuration
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'Insecure_Instance_SSFS_Encryption_Configuration'}
      />
      <Configuration
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'LOB_Garbage_Collection_Activity'}
      />
      <Configuration
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'License_Expiry'}
      />
      <Configuration
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'Licensed_Memory_Usage'}
      />
      <Configuration
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'RFC_Connections'}
      />
      <Configuration
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'Runtime_of_the_Log_Backups'}
      />
      <Configuration
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'Trace_Settings'}
      />
      <Configuration
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'Unassigned_Volumes'}
      />
    </Fragment>
  );
}
