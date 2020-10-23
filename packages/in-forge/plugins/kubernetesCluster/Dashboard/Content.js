import React from 'react';

import RedirectWithHash from 'in-components/RedirectWithHash';
import { getClusterDashboard } from 'in-kubernetes/navigation/paths';

export default function KubernetesClusterDashboard({ snapshot }) {
  return <RedirectWithHash to$={getClusterDashboard(snapshot.get('id'))} />;
}
