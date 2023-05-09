/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Exception from 'in-sap/Dashboards/tables/Exception';

export default function ExcepMetrics({ timeConfig, data: sap }) {
  return (
    <>
      <Exception
        snapshotId={sap.id}
        techEventName={sap.missingMetrics}
        eventNames={sap.missingEventNames}
        timeConfig={timeConfig}
        configurationName="System_Exceptions"
      />
    </>
  );
}
