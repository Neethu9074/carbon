/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

// @ts-expect-error
import RedirectWithHash from 'in-components/RedirectWithHash';
import { useDaemonSetDashboard } from 'in-kubernetes/navigation/paths';
import { SnapshotItem as BaseSnapshotItem } from 'in-types';

interface SnapshotItem extends Omit<BaseSnapshotItem, 'id'> {
  get: (id: string) => string;
  id: string;
}

interface Props {
  snapshot: SnapshotItem;
}

export default function KubernetesDaemonSetDashboard({ snapshot }: Props) {
  const href: string = useDaemonSetDashboard(snapshot.get('id'));

  return <RedirectWithHash href={href} />;
}
