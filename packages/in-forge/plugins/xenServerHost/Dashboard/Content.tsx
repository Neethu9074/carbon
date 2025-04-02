/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

// @ts-expect-error needs TS migration
import RedirectWithHash from 'in-components/RedirectWithHash';
import { useXenServerEntityLink } from 'in-xenserver/navigation/paths';
import { SnapshotData } from 'in-stores/snapshot';

export default function XenServerHostDashboard({ snapshot }: { snapshot: SnapshotData }) {
  const getXenServerHostDashboard = useXenServerEntityLink('host');
  return <RedirectWithHash href={getXenServerHostDashboard(snapshot.get('id'))} />;
}
