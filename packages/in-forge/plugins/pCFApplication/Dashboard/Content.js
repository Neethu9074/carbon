import React from 'react';

import { getApplicationDashboard } from 'in-cloudfoundry/navigation/paths';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';

export default function PCFApplicationDashboard({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return <RedirectWithHash to$={getApplicationDashboard(snapshotId)} />;
}
