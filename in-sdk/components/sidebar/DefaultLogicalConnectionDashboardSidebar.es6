import irpt from 'react-immutable-proptypes';
import React from 'react';

import ConnectedEntitiesList from 'in-components/ConnectedEntitiesList';


export default function DefaultLogicalConnectionDashboardSidebar({snapshot}) {
  return (
    <ConnectedEntitiesList snapshotId={snapshot.get('id')} />
  );
}

DefaultLogicalConnectionDashboardSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
