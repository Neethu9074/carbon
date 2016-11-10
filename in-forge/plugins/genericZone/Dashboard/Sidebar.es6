import React from 'react';

import ZoneHostsList from 'in-sdk/components/sidebar/ZoneHostsList';
import Info from 'in-forge/plugins/genericZone/Info';

export default function GenericZoneSidebar({snapshot}) {
  return (
    <div>
      <Info />
      <ZoneHostsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
