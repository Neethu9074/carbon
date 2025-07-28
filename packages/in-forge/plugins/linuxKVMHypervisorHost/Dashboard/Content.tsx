/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { useLinuxKVMHypervisorEntityLink } from 'in-linux-kvm-hypervisor/navigation/paths';
// @ts-expect-error needs TS migration
import RedirectWithHash from 'in-components/RedirectWithHash';
import { SnapshotData } from 'in-stores/snapshot';

export default function LinuxKVMHypervisorHostDashboard({ snapshot }: { snapshot: SnapshotData }) {
  const getLinuxKVMHypervisorHostDashboard = useLinuxKVMHypervisorEntityLink('host');
  return <RedirectWithHash href={getLinuxKVMHypervisorHostDashboard(snapshot.get('id'))} />;
}
