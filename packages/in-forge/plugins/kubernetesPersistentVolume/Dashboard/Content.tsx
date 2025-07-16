/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import DefaultDashboard from 'in-infrastructure/Dashboard/components/DefaultDashboard';
// @ts-expect-error
import RedirectWithHash from 'in-components/RedirectWithHash';
import { usePersistentVolumeDashboard } from 'in-kubernetes/navigation/paths';
import { persistentVolumeSupportEnabled } from 'in-services/featureFlags';
import { SnapshotItem as BaseSnapshotItem, TimeConfig } from 'in-types';

interface SnapshotItem extends Omit<BaseSnapshotItem, 'id'> {
  get: (id: string) => string;
  id: string;
}

interface Props {
  snapshot: SnapshotItem;
  timeConfig: TimeConfig;
}

export default function KubernetesPersistentVolumeDashboard({ snapshot, timeConfig }: Props) {
  const url: string = usePersistentVolumeDashboard(snapshot.get('id'), { timeConfig });
  const [base, queryString] = url.split('?');
  const params = new URLSearchParams(queryString);
  params.delete('snapshotId');
  const href = `${base}?${params.toString()}`;

  if (persistentVolumeSupportEnabled) {
    return <RedirectWithHash href={href} />;
  }

  return <DefaultDashboard snapshot={snapshot} timeConfig={timeConfig} />;
}
