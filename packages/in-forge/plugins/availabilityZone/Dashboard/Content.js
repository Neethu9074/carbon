/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import UnmonitoredHostsTable from 'in-forge/plugins/availabilityZone/Dashboard/UnmonitoredHostsTable';
import HostsTable from 'in-forge/plugins/genericZone/Dashboard/HostsTable';

export default function AvailabilityZoneDashboard({ snapshot }) {
  if ('unmonitored-hosts-zone' === snapshot.getIn(['entityId', 'steadyId'], '')) {
    return <UnmonitoredHostsTable snapshotId={snapshot.get('id')} />;
  }
  return <HostsTable snapshotId={snapshot.get('id')} />;
}
