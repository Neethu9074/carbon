/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ZoneItemsList from 'in-sdk/components/sidebar/ZoneItemsList';

export default function AvailabilityZoneSidebar({ snapshot }) {
  return (
    <div>
      <ZoneItemsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
