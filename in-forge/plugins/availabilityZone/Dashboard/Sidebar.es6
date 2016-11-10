import React from 'react';

import ZoneHostsList from 'in-sdk/components/sidebar/ZoneHostsList';
import Info from 'in-forge/plugins/availabilityZone/Info';


export default function AvailabilityZoneSidebar({snapshot}) {
  return (
    <div>
      <Info />
      <ZoneHostsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
