import React from 'react';

import HostsTable from 'in-forge/plugins/genericZone/Dashboard/HostsTable';
import UnmonitoredHostsTable from 'in-forge/plugins/availabilityZone/Dashboard/UnmonitoredHostsTable';

export default function AvailabilityZoneDashboard({ snapshot }) {
  if ('unmonitored-hosts-zone' === snapshot.getIn(['entityId', 'steadyId'], '')) {
    return <UnmonitoredHostsTable snapshotId={snapshot.get('id')} />;
  }
  return <HostsTable snapshotId={snapshot.get('id')} />;
}
