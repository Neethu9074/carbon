import React from 'react';

import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';

export default function KubernetesPodDashboard({ snapshot }) {
  return <RedirectWithHash to$={getPodDashboard(snapshot.get('id'))} />;
}
