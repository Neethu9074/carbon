/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import AdvanceSpinningDiskTypeTable from './AdvanceSpinningDiskTypeTable';
import AdvanceSolidStateDiskTable from './AdvanceSolidStateDiskTable';
import BasicSpinningDiskTypeTable from './BasicSpinningDiskTypeTable';
import BasicSolidStateDiskTable from './BasicSolidStateDiskTable';
import NonVolatileMemoryTable from './NonVolatileMemoryTable';
import SystemDiskStatusTable from './SystemDiskStatusTable';

export default function IbmIDiskInfoDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <SystemDiskStatusTable snapshotId={snapshotId} timeConfig={timeConfig} />
      <AdvanceSolidStateDiskTable snapshotId={snapshotId} timeConfig={timeConfig} />
      <BasicSolidStateDiskTable snapshotId={snapshotId} timeConfig={timeConfig} />
      <BasicSpinningDiskTypeTable snapshotId={snapshotId} timeConfig={timeConfig} />
      <AdvanceSpinningDiskTypeTable snapshotId={snapshotId} timeConfig={timeConfig} />
      <NonVolatileMemoryTable snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
}
