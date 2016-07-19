import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalSidebarKpis from 'in-components/DefaultLogicalSidebarKpis/DefaultLogicalSidebarKpis';
import ConnectedEntitiesList from 'in-components/ConnectedEntitiesList';


export default function LogicalRabbitMqConnectionSidebar({snapshot}) {
  return (
    <div>
      <DefaultLogicalSidebarKpis snapshot={snapshot} />
      <ConnectedEntitiesList snapshotId={snapshot.get('id')} />
    </div>
  );
}

LogicalRabbitMqConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
