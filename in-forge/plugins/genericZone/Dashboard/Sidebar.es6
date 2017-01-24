import React from 'react';

import ZoneHostsList from 'in-sdk/components/sidebar/ZoneHostsList';

export default function GenericZoneSidebar({snapshot}) {
  return (
    <ZoneHostsList snapshotId={snapshot.get('id')} />
  );
}
