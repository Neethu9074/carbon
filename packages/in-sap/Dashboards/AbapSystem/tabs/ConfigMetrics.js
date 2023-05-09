/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Configuration from 'in-sap/Dashboards/tables/Configuration';

export default function ConfigMetrics({ timeConfig, data: vm }) {
  return (
    <>
      <Configuration
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName="ABAP_Transports"
      />
      <Configuration
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName="Expiring_ABAP_certificates"
      />
      <Configuration
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName="Failed_ABAP_Transports"
      />
      <Configuration
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName="Global_changes_allowed"
      />
      <Configuration
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName="ICF_Service_Changes"
      />
      <Configuration
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName="RFC_Destinations"
      />
      <Configuration
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName="SAP_Notes"
      />
      <Configuration
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName="System_Configuration"
      />
      <Configuration
        snapshotId={vm.id}
        techEventName={vm.missingMetrics}
        eventNames={vm.missingEventNames}
        timeConfig={timeConfig}
        configurationName="Users_with_critical_profiles"
      />
    </>
  );
}
