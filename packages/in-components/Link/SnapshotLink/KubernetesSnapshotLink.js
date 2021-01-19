/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Link from 'in-components/Link';

import './SnapshotLink.less';

const block = 'in-snapshot-link';

export default function KubernetesSnapshotLink({ getKubernetesViewEntityDashboard, snapshotId, children }) {
  return (
    <Link href$={getKubernetesViewEntityDashboard(snapshotId)} className={block}>
      {children}
    </Link>
  );
}
