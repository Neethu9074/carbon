/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import Info from 'in-forge/plugins/windowsHypervisorVM/Info';
import { SnapshotData } from 'in-stores/snapshot/snapshot';

export default function WindowsHypervisorVMSidebar({ snapshot }: { snapshot: SnapshotData }) {
  return (
    <div>
      <Info snapshot={snapshot} />
    </div>
  );
}
