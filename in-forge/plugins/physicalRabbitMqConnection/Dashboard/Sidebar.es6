import irpt from 'react-immutable-proptypes';
import React from 'react';

import ConnectedEntitiesList from 'in-components/ConnectedEntitiesList';


export default function PhysicalRabbitMqConnectionSidebar({snapshot}) {
  return (
    <ConnectedEntitiesList snapshotId={snapshot.get('id')} />
  );
}

PhysicalRabbitMqConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
