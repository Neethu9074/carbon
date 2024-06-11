/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Link, LoadingSkeleton } from '@instana/components';
import { useObservable } from '@instana/hooks';

//@ts-expect-error needs TS migration
import HealthyPluginIcon from 'in-components/health/HealthyPluginIcon';
//@ts-expect-error needs TS migration
import { getLabel } from 'in-sdk/snapshot';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import { SnapshotMap } from 'in-components/EntityLink';
import { getSnapshot } from 'in-stores/snapshot';
import { plugins } from 'in-forge/constants';

import locals from 'in-infrastructure/agentView/components/AgentsTable.mless';

type Row = {
  snapshot: SnapshotMap;
};

interface Props {
  row: Row;
}

export function LinkWithHealthIndicator({ row }: Props) {
  const hostSnapshot = useObservable(
    getHostSnapshotId(row.snapshot).flatMap(hostId => {
      const to = Number(row.snapshot.get('to') || Date.now());
      const from = Number(row.snapshot.get('from') || Date.now());
      const reportingWindowSize = to - from;
      const reportingCenterTime = from + reportingWindowSize / 2;
      return getSnapshot(hostId, getTimeConfigAtMoment(reportingCenterTime));
    }),
    []
  );

  const getDashboardLink = useGetDashboardLink();

  const snapshotId = hostSnapshot?.get('id');
  const href = getDashboardLink(snapshotId);
  const label = hostSnapshot ? getLabel(hostSnapshot) : getLabel(row.snapshot);

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
