import React from 'react';

import HostsTable from 'in-forge/plugins/genericZone/Dashboard/HostsTable';


export default function AvailabilityZoneDashboard({snapshot}) {
  return (
    <HostsTable snapshotId={snapshot.get('id')} />
  );
}
