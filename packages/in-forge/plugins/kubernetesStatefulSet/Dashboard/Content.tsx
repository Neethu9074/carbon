/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SnapshotItem as BaseSnapshotItem } from '@instana/types';

// @ts-expect-error
import RedirectWithHash from 'in-components/RedirectWithHash';
import { useStatefulSetDashboard } from 'in-kubernetes/navigation/paths';

interface SnapshotItem extends Omit<BaseSnapshotItem, 'id'> {
  get: (id: string) => string;
  id: string;
}

interface Props {
  snapshot: SnapshotItem;
}

export default function KubernetesStatefulSetDashboard({ snapshot }: Props) {
  const href: string = useStatefulSetDashboard(snapshot.get('id'));

  return <RedirectWithHash href={href} />;
}
