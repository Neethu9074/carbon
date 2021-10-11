/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ZoneItemsTable from './ZoneItemsTable';

export default function AvailabilityZoneDashboard({ snapshot }) {
  return <ZoneItemsTable snapshotId={snapshot.get('id')} />;
}
