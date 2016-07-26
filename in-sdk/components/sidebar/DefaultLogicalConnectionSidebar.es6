import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalConnectionSidebarKpis from 'in-sdk/components/sidebar/DefaultLogicalConnectionSidebarKpis';
import ConnectedEntitiesList from 'in-sdk/components/sidebar/ConnectedEntitiesList';
import Separator from 'in-sdk/components/sidebar/Separator';


export default function DefaultLogicalConnectionSidebar({snapshot}) {
  return (
    <div>
      <DefaultLogicalConnectionSidebarKpis snapshot={snapshot} />
      <Separator />
      <ConnectedEntitiesList snapshotId={snapshot.get('id')} />
    </div>
  );
}

DefaultLogicalConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
