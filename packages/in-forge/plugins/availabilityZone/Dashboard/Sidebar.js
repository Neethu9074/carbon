/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ZoneHostsList from 'in-sdk/components/sidebar/ZoneHostsList';

export default function AvailabilityZoneSidebar({ snapshot }) {
  return (
    <div>
      <ZoneHostsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
