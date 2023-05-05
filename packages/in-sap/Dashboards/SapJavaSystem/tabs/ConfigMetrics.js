/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Configuration from 'in-sap/Dashboards/tables/Configuration';

export default function ConfigMetrics({ timeConfig, data: sap }) {
  return (
    <>
      <Configuration
        snapshotId={sap.id}
        techEventName={sap.missingMetrics}
        eventNames={sap.missingEventNames}
        timeConfig={timeConfig}
        configurationName="Expiring_certificates_per_instance"
      />
    </>
  );
}
