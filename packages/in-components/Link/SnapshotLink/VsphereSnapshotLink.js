import React from 'react';

import Link from 'in-components/Link';

import './SnapshotLink.less';

const block = 'in-snapshot-link';

export default function VsphereSnapshotLink({ getVsphereViewEntityDashboard, snapshotId, children }) {
  return (
    <Link href$={getVsphereViewEntityDashboard(snapshotId)} className={block}>
      {children}
    </Link>
  );
}
