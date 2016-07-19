import irpt from 'react-immutable-proptypes';
import React from 'react';

import ConnectedEntitiesList from 'in-components/ConnectedEntitiesList';


export default function LogicalCassandraConnectionSidebar({snapshot}) {
  return (
    <ConnectedEntitiesList snapshotId={snapshot.get('id')} />
  );
}

LogicalCassandraConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
