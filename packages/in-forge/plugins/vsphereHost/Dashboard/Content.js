import React from 'react';

import { getVsphereHostDashboard } from 'in-vsphere/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function VsphereHostDashboard({ snapshot }) {
  return <RedirectWithHash to$={getVsphereHostDashboard(snapshot.get('id'))} />;
}
