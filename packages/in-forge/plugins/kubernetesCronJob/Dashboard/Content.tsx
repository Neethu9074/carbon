/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

// @ts-expect-error
import RedirectWithHash from 'in-components/RedirectWithHash';
import { useCronJobDashboard } from 'in-kubernetes/navigation/paths';
import { SnapshotItem as BaseSnapshotItem } from 'in-types';

interface SnapshotItem extends Omit<BaseSnapshotItem, 'id'> {
  id: string;
}

interface Props {
  snapshot: SnapshotItem;
}

export default function KubernetesCronJobDashboard({ snapshot }: Props) {
  const to: string = useCronJobDashboard(snapshot.id);

  return <RedirectWithHash to={to} />;
}
