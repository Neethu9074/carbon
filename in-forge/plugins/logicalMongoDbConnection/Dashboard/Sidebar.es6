import irpt from 'react-immutable-proptypes';
import React from 'react';

import ConnectedEntitiesList from 'in-components/ConnectedEntitiesList';


export default function LogicalMongoDbConnectionSidebar({snapshot}) {
  return (
    <ConnectedEntitiesList snapshotId={snapshot.get('id')} />
  );
}

LogicalMongoDbConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
