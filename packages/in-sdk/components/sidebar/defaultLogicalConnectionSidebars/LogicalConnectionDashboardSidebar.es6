import React from 'react';

import ConnectedEntitiesList from 'in-sdk/components/sidebar/ConnectedEntitiesList';

export default function LogicalConnectionDashboardSidebar({ snapshot }) {
  return <ConnectedEntitiesList snapshotId={snapshot.get('id')} />;
}
