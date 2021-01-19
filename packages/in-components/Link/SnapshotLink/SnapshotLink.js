/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { getLinkToSnapshotInCurrentView } from 'in-stores/navigation/paths/dashboardPaths';
import Link from 'in-components/Link';

import './SnapshotLink.less';

const block = 'in-snapshot-link';

export default function SnapshotLink({ snapshotId, children }) {
  return (
    <Link href$={getLinkToSnapshotInCurrentView(snapshotId)} className={block}>
      {children}
    </Link>
  );
}
