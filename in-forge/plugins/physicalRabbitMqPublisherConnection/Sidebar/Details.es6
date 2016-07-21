import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalSidebarKpis from 'in-components/DefaultLogicalSidebarKpis/DefaultLogicalSidebarKpis';
import ConnectedEntitiesList from 'in-components/ConnectedEntitiesList';


export default function PhysicalRabbitMqPublisherConnectionSidebar({snapshot}) {
  return (
    <div>
      <DefaultLogicalSidebarKpis snapshot={snapshot} />
      <ConnectedEntitiesList snapshotId={snapshot.get('id')} />
    </div>
  );
}

PhysicalRabbitMqPublisherConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
