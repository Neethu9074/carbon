import irpt from 'react-immutable-proptypes';
import React from 'react';

import ConnectedEntitiesList from 'in-components/ConnectedEntitiesList';


export default function LogicalRabbitMqConsumerConnectionSidebar({snapshot}) {
  return (
    <ConnectedEntitiesList snapshotId={snapshot.get('id')} />
  );
}

LogicalRabbitMqConsumerConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
