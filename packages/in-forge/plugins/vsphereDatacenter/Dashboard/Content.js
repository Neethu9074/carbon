import React from 'react';

import RedirectWithHash from 'in-components/RedirectWithHash';
import { getVsphereDatacenterDashboard } from 'in-vsphere/navigation/paths';

export default function VsphereDatacenterDashboard({ snapshot }) {
  return <RedirectWithHash to$={getVsphereDatacenterDashboard(snapshot.get('id'))} />;
}
