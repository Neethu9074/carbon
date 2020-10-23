import React from 'react';

import { getApplicationDashboard } from 'in-cloudfoundry/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';
import { pcfEnabled } from 'in-services/featureFlags';

export default function PCFApplicationDashboard({ snapshot }) {
  if (pcfEnabled) {
    const snapshotId = snapshot.get('id');
    return <RedirectWithHash to$={getApplicationDashboard(snapshotId)} />;
  }
  return <div />;
}
