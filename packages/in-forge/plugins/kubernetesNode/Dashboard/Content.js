import React from 'react';

import RedirectWithHash from 'in-components/RedirectWithHash';
import { getNodeDashboard } from 'in-kubernetes/navigation/paths';

export default function KubernetesNodeDashboard({ snapshot }) {
  return <RedirectWithHash to$={getNodeDashboard(snapshot.get('id'))} />;
}
