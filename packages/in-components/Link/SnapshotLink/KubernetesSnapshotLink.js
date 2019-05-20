import React from 'react';

import { getLinkToSnapshotInCurrentView } from 'in-stores/navigation/paths/dashboardPaths';
import { kubernetesEnabled } from 'in-services/featureFlags';
import Link from 'in-components/Link';

import './SnapshotLink.less';

const block = 'in-snapshot-link';

export default function KubernetesSnapshotLink({ getKubernetesViewEntityDashboard, snapshotId, children }) {
  return (
    <Link
      href$={(kubernetesEnabled ? getKubernetesViewEntityDashboard : getLinkToSnapshotInCurrentView)(snapshotId)}
      className={block}
    >
      {children}
    </Link>
  );
}
