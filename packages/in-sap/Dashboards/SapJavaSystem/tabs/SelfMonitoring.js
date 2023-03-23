/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import SelfMonitoringMetrics from 'in-sap/Dashboards/tables/SelfMonitoringMetrics';

export default function SelfMonitoring({ timeConfig, data: vm }) {
  return (
    <Fragment>
      <SelfMonitoringMetrics
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'Configuration_XML_is_outdated'}
      />
      <SelfMonitoringMetrics
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'DPC_Database_Extractor'}
      />
      <SelfMonitoringMetrics
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'Data_Supplier_for_Technical_System_is_missing_or_outdated'}
      />
      <SelfMonitoringMetrics
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'Diagnostic_Agent_for_Technical_System_Monitoring_unavailable'}
      />
      <SelfMonitoringMetrics
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'Errors_in_Last_Monitoring_Configuration'}
      />
      <SelfMonitoringMetrics
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'Host_Agent_Connection_Status'}
      />
      <SelfMonitoringMetrics
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName={'Last_Configuration_Status_in_Monitoring'}
      />
    </Fragment>
  );
}
