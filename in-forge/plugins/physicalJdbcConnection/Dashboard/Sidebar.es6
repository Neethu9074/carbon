import irpt from 'react-immutable-proptypes';
import React from 'react';

import ConnectedEntitiesList from 'in-components/ConnectedEntitiesList';


export default function PhysicalJdbcConnectionSidebar({snapshot}) {
  return (
    <ConnectedEntitiesList snapshotId={snapshot.get('id')} />
  );
}

PhysicalJdbcConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
