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

export default function NutanixHostDashboard({ snapshot }: { snapshot: SnapshotData }) {
  const getNutanixHostDashboard = useNutanixEntityLink('host');

  return <RedirectWithHash href={getNutanixHostDashboard(snapshot.get('id'))} />;
}
