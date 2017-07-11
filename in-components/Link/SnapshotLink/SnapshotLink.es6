import React from 'react';

import { getLinkToSnapshotInCurrentView } from 'in-stores/navigation';
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
