import React from 'react';

import { getVsphereVmDashboard } from 'in-vsphere/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function VsphereVmDashboard({ snapshot }) {
  return <RedirectWithHash to$={getVsphereVmDashboard(snapshot.get('id'))} />;
}
