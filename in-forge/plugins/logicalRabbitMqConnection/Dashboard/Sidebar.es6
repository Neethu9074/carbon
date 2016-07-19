import irpt from 'react-immutable-proptypes';
import React from 'react';

import ConnectedEntitiesList from 'in-components/ConnectedEntitiesList';


export default function LogicalRabbitMqConnectionSidebar({snapshot}) {
  return (
    <ConnectedEntitiesList snapshotId={snapshot.get('id')} />
  );
}

LogicalRabbitMqConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
