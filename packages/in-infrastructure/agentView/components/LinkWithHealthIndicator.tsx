/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Link, LoadingSkeleton } from '@instana/components';

//@ts-expect-error needs TS migration
import HealthyPluginIcon from 'in-components/health/HealthyPluginIcon';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { SnapshotData } from 'in-stores/snapshot';
import { plugins } from 'in-forge/constants';

import locals from 'in-infrastructure/agentView/components/AgentsTable.mless';

interface Props {
  hostSnapshotId: string;
  hostSnapshot: SnapshotData;
  label: string;
}

export function LinkWithHealthIndicator({ hostSnapshotId, hostSnapshot, label }: Props) {
  const getDashboardLink = useGetDashboardLink();

  const snapshotId = hostSnapshot?.get('id');
  const href = getDashboardLink(hostSnapshotId);

  return (
    <Link href={href} className={locals.link}>
      {hostSnapshot ? (
        <HealthyPluginIcon className={locals.icon} plugin={plugins.instanaAgent} snapshotId={snapshotId} />
      ) : (
        <LoadingSkeleton className={locals.skeleton} />
      )}
      {label}
    </Link>
  );
}
