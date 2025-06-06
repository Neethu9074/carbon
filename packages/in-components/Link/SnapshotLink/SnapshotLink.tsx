/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import { Link } from '@instana/components';

import { useGetLinkToSnapshotInCurrentView } from 'in-stores/navigation/paths/dashboardPaths';

import locals from './SnapshotLink.mless';

export default function SnapshotLink({ snapshotId, children }: { snapshotId: string; children: ReactNode }) {
  const href = useGetLinkToSnapshotInCurrentView(snapshotId);

  return (
    <Link href={href} className={locals.inSnapshotLink}>
      {children}
    </Link>
  );
}
