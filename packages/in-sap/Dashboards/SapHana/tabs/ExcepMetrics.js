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
        configurationName={'Disabled_Metrics'}
      />
      <Exception
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'Failed_IO_Reads'}
      />
      <Exception
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'Failed_Delta_Merges'}
      />
      <Exception
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'Failed_IO_Writes'}
      />
      <Exception
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'Log_segments_not_free_for_reuse'}
      />
      <Exception
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'New_HANA_Trace_Files'}
      />
      <Exception
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'New_OOM_Trace_Files'}
      />
      <Exception
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'Size_of_backup_catalog_MB'}
      />
      <Exception
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'Tables_or_Table_histories_GT_1_billion_rows'}
      />
    </Fragment>
  );
}
