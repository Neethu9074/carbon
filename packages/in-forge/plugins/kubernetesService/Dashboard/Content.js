import React from 'react';

import RedirectWithHash from 'in-components/RedirectWithHash';
import { getServiceDashboard } from 'in-kubernetes/navigation/paths';

export default function KubernetesServiceDashboard({ snapshot }) {
  return <RedirectWithHash to$={getServiceDashboard(snapshot.get('id'))} />;
}
