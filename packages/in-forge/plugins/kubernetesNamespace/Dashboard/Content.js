import React from 'react';

import RedirectWithHash from 'in-components/RedirectWithHash';
import { getNamespaceDashboard } from 'in-kubernetes/navigation/paths';

export default function KubernetesNamespaceDashboard({ snapshot }) {
  return <RedirectWithHash to$={getNamespaceDashboard(snapshot.get('id'))} />;
}
