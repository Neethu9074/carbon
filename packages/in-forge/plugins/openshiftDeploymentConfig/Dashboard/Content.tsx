/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

// @ts-expect-error
import RedirectWithHash from 'in-components/RedirectWithHash';
import { useDeploymentConfigDashboard } from 'in-kubernetes/navigation/paths';
import { SnapshotItem as BaseSnapshotItem, TimeConfig } from 'in-types';

interface SnapshotItem extends Omit<BaseSnapshotItem, 'id'> {
  get: (id: string) => string;
  id: string;
}

interface Props {
  snapshot: SnapshotItem;
  timeConfig: TimeConfig;
}

export default function OpenshiftDeploymentConfigDashboard({ snapshot, timeConfig }: Props) {
  const href: string = useDeploymentConfigDashboard(snapshot.get('id'), { timeConfig });

  return <RedirectWithHash href={href} />;
}
