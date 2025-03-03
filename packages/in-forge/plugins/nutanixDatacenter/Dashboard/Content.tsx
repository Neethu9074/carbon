/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

// @ts-expect-error needs TS migration
import RedirectWithHash from 'in-components/RedirectWithHash';
import { useNutanixEntityLink } from 'in-nutanix/navigation/paths';
import { SnapshotData } from 'in-stores/snapshot';

export default function NutanixDatacenterDashboard({ snapshot }: { snapshot: SnapshotData }) {
  const getNutanixDatacenterDashboard = useNutanixEntityLink('datacenter');

  return <RedirectWithHash href={getNutanixDatacenterDashboard(snapshot.get('id'))} />;
}
