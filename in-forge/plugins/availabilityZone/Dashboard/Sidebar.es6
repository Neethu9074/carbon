import React from 'react';

import ZoneHostsList from 'in-sdk/components/sidebar/ZoneHostsList';
import Separator from 'in-sdk/components/sidebar/Separator';
import Info from 'in-forge/plugins/availabilityZone/Info';


export default function AvailabilityZoneSidebar({snapshot}) {
  return (
    <div>
      <Separator />
      <Info />
      <ZoneHostsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
