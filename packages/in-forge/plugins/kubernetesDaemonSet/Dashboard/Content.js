import React from 'react';

import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import { getDaemonSetDashboard } from 'in-kubernetes/navigation/paths';

export default function KubernetesDaemonSetDashboard({ snapshot }) {
  return <RedirectWithHash to$={getDaemonSetDashboard(snapshot.get('id'))} />;
}
