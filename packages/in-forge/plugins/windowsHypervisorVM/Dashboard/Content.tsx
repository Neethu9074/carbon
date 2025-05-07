/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

// @ts-expect-error needs TS migration
import RedirectWithHash from 'in-components/RedirectWithHash';
import { useWindowsHypervisorEntityLink } from 'in-windowshypervisor/navigation/paths';
import { SnapshotData } from 'in-stores/snapshot';

export default function WindowsHypervisorVMDashboard({ snapshot }: { snapshot: SnapshotData }) {
  const getWindowsHypervisorVMDashboard = useWindowsHypervisorEntityLink('vm');
  return <RedirectWithHash href={getWindowsHypervisorVMDashboard(snapshot.get('id'))} />;
}
