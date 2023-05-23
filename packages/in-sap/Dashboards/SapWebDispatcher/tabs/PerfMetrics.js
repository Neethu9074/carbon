/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Performance from 'in-sap/Dashboards/tables/Performance';

export default function PerfMetrics({ timeConfig, data: sap }) {
  return (
    <>
      <Performance
        snapshotId={sap.id}
        techEventName={sap.missingMetrics}
        eventNames={sap.missingEventNames}
        timeConfig={timeConfig}
        configurationName="System_Performance"
      />
    </>
  );
}
