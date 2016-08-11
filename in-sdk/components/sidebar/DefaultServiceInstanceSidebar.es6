import React from 'react';

import ServiceInstancePhysicalEntity from 'in-sdk/components/sidebar/ServiceInstancePhysicalEntity';
import DefaultLogicalSidebarKpis from 'in-sdk/components/sidebar/DefaultLogicalSidebarKpis';
import ConnectionList from 'in-sdk/components/sidebar/ConnectionList';
import Separator from 'in-sdk/components/sidebar/Separator';


export default function DefaultLogicalSidebar({snapshot}) {
  return (
    <div>
      <DefaultLogicalSidebarKpis snapshot={snapshot} />

      <Separator />

      <ServiceInstancePhysicalEntity snapshotId={snapshot.get('id')} />

      <Separator />

      <ConnectionList snapshotId={snapshot.get('id')} />
    </div>
  );
}
