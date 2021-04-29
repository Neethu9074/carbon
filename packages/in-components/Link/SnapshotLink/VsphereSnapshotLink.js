/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Link } from '@instana/components';
import React from 'react';

import './SnapshotLink.less';

const block = 'in-snapshot-link';

export default function VsphereSnapshotLink({ getVsphereViewEntityDashboard, snapshotId, children, parameters }) {
  return (
    <Link href$={getVsphereViewEntityDashboard(snapshotId, parameters)} className={block}>
      {children}
    </Link>
  );
}
