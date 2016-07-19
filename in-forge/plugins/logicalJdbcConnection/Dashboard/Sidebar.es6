import irpt from 'react-immutable-proptypes';
import React from 'react';

import ConnectedEntitiesList from 'in-components/ConnectedEntitiesList';


export default function LogicalJdbcConnectionSidebar({snapshot}) {
  return (
    <ConnectedEntitiesList snapshotId={snapshot.get('id')} />
  );
}

LogicalJdbcConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
