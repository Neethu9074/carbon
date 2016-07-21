import irpt from 'react-immutable-proptypes';
import React from 'react';

import ConnectedEntitiesList from 'in-components/ConnectedEntitiesList';


export default function PhysicalRabbitMqConsumerConnectionSidebar({snapshot}) {
  return (
    <ConnectedEntitiesList snapshotId={snapshot.get('id')} />
  );
}

PhysicalRabbitMqConsumerConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
