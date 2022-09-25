/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import CoordiQmgrsTable from 'in-forge/plugins/ibmMqMftZone/Dashboard/CoordiQmgrsTable';

export default function IbmMqMftZoneDashboard(snapshot, timeConfig) {
  return (
    <div>
      <CoordiQmgrsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
