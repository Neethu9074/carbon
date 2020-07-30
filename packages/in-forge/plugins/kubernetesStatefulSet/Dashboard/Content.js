import React from 'react';

import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import { getDeploymentDashboard } from 'in-kubernetes/navigation/paths';

export default function KubernetesStatefulSetDashboard({ snapshot }) {
  return <RedirectWithHash to$={getDeploymentDashboard(snapshot.get('id'))} />;
}
