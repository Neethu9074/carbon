import irpt from 'react-immutable-proptypes';
import React from 'react';

import ConnectedEntitiesList from 'in-components/ConnectedEntitiesList';


export default function PhysicalCassandraConnectionSidebar({snapshot}) {
  return (
    <ConnectedEntitiesList snapshotId={snapshot.get('id')} />
  );
}

PhysicalCassandraConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
