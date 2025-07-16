/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import Info from 'in-forge/plugins/windowsHypervisorHost/Info';
import { SnapshotData } from 'in-stores/snapshot/snapshot';

export default function WindowsHypervisorHostSidebar({ snapshot }: { snapshot: SnapshotData }) {
  return (
    <div>
      <Info snapshot={snapshot} />
    </div>
  );
}
