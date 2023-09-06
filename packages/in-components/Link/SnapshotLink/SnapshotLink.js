/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import { getLinkToSnapshotInCurrentView } from 'in-stores/navigation/paths/dashboardPaths';

import locals from './SnapshotLink.mless';

export default function SnapshotLink({ snapshotId, children }) {
  return (
    <Link href={getLinkToSnapshotInCurrentView(snapshotId)} className={locals.inSnapshotLink}>
      {children}
    </Link>
  );
}
