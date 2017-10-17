import React from 'react';

import Endpoint from 'in-sdk/components/dashboard/LogicalServiceDashboard/components/Endpoint';
import { getLabel } from 'in-sdk/snapshot';

export default function ConnectionInformation({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      Fancy conenction chart for: {` ${getLabel(snapshot)}`}
      <Endpoint snapshotId={snapshotId} type="source" />
      <Endpoint snapshotId={snapshotId} type="destination" />
    </div>
  );
}
