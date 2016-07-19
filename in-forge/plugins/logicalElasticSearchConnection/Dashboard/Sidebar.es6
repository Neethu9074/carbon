import irpt from 'react-immutable-proptypes';
import React from 'react';

import ConnectedEntitiesList from 'in-components/ConnectedEntitiesList';


export default function LogicalElasticSearchConnectionSidebar({snapshot}) {
  return (
    <ConnectedEntitiesList snapshotId={snapshot.get('id')} />
  );
}

LogicalElasticSearchConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
