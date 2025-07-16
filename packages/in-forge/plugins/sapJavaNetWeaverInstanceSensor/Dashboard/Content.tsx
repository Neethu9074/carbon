/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

// @ts-expect-error needs TS migration
import { useSapJavaNetWeaverInstanceSensorDashboard } from 'in-sap/navigation/paths';
// @ts-expect-error needs TS migration
import RedirectWithHash from 'in-components/RedirectWithHash';
import { netweaverEnabled } from 'in-services/featureFlags';
import { SnapshotData } from 'in-stores/snapshot';

export default function SystemDashboard({ snapshot }: { snapshot: SnapshotData }) {
  const href = netweaverEnabled ? useSapJavaNetWeaverInstanceSensorDashboard(snapshot.get('id')) : '/';
  return <RedirectWithHash href={href} />;
}
