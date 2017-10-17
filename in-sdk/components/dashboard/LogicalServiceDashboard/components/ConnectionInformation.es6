import React from 'react';

import Endpoint from 'in-sdk/components/dashboard/LogicalServiceDashboard/components/Endpoint';
import Columize from 'in-sdk/components/dashboard/Columize';

export default function ConnectionInformation({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <Columize>
      <Endpoint snapshotId={snapshotId} type="source" />
      <Endpoint snapshotId={snapshotId} type="destination" />
    </Columize>
  );
}
