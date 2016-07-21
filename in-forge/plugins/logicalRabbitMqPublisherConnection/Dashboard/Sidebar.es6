import irpt from 'react-immutable-proptypes';
import React from 'react';

import ConnectedEntitiesList from 'in-components/ConnectedEntitiesList';


export default function LogicalRabbitMqPublisherConnectionSidebar({snapshot}) {
  return (
    <ConnectedEntitiesList snapshotId={snapshot.get('id')} />
  );
}

LogicalRabbitMqPublisherConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
