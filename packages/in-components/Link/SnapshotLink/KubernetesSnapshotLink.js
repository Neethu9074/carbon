/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import locals from './SnapshotLink.mless';

export default function KubernetesSnapshotLink({ getKubernetesViewEntityDashboard, snapshotId, children }) {
  return (
    <Link href$={getKubernetesViewEntityDashboard(snapshotId)} className={locals.inSnapshotLink}>
      {children}
    </Link>
  );
}
