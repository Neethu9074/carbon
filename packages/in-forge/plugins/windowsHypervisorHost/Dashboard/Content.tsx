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

export default function WindowsHypervisorHostDashboard({ snapshot }: { snapshot: SnapshotData }) {
  const getWindowsHypervisorHostDashboard = useWindowsHypervisorEntityLink('host');
  return <RedirectWithHash href={getWindowsHypervisorHostDashboard(snapshot.get('id'))} />;
}
