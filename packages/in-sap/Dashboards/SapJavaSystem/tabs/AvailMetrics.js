/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Availability from 'in-sap/Dashboards/tables/Availability';

export default function AvailMetrics({ timeConfig, data: sap }) {
  return (
    <>
      <Availability
        snapshotId={sap.id}
        techEventName={sap.missingMetrics}
        eventNames={sap.missingEventNames}
        timeConfig={timeConfig}
        configurationName="JAVA SYSTEM AVAILABILITY"
      />
      <Availability
        snapshotId={sap.id}
        techEventName={sap.missingMetrics}
        eventNames={sap.missingEventNames}
        timeConfig={timeConfig}
        configurationName="BMP_Kernal_Status"
      />
    </>
  );
}
