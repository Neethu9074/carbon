/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import OpenstackRegionSidebar from 'in-openstack/lists/components/OpenstackRegionSidebar';
import DefaultSidebar from 'in-infrastructure/Dashboard/components/DefaultSidebar';

export default function OpenstackRegionsSidebar({ snapshot }) {
  return (
    <div>
      <DefaultSidebar snapshot={snapshot} />
      <OpenstackRegionSidebar snapshotId={snapshot.get('id')} />
    </div>
  );
}
