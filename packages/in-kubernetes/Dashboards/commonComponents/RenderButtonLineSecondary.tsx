/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

import DashboardHeaderButtonSection from 'in-infrastructure/Dashboard/components/DashboardHeaderButtonSection';
import { getSnapshot } from 'in-stores/snapshot';

interface RenderButtonLineSecondaryProps {
  timeConfig: TimeConfig;
  snapshotId: string;
}

export default function RenderButtonLineSecondary({ timeConfig, snapshotId }: RenderButtonLineSecondaryProps) {
  const snapShot = useObservable(getSnapshot(snapshotId, timeConfig), [snapshotId, timeConfig]);
  if (!snapShot) {
    return <></>;
  }
  return <DashboardHeaderButtonSection snapshot={snapShot} snapshotId={snapshotId} timeConfig={timeConfig} />;
}
