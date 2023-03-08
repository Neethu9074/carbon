/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import DefaultSidebar from 'in-infrastructure/Dashboard/components/DefaultSidebar';
import PhmcSystemSidebar from 'in-phmc/lists/components/PhmcSystemSidebar';

export default function PhmcSystemsSidebar({ snapshot }) {
  return (
    <div>
      <DefaultSidebar snapshot={snapshot} />
      <PhmcSystemSidebar snapshotId={snapshot.get('id')} />
    </div>
  );
}
