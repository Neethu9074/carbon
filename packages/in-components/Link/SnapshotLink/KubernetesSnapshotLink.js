/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Link } from '@instana/components';

import locals from './SnapshotLink.mless';

export default function KubernetesSnapshotLink({ viewEntityDashboardHref, children }) {
  return (
    <Link href={viewEntityDashboardHref} className={locals.inSnapshotLink}>
      {children}
    </Link>
  );
}
