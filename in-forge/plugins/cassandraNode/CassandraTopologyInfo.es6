import React from 'react';

import {getLinkToSnapshotInCurrentView} from 'in-stores/navigation';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import getZone from 'in-hoc/getZone';


export default getZone(connectTo(props => {
  if (!props.zoneSnapshot) {
    return {};
  }
  return {
    href: getLinkToSnapshotInCurrentView(props.zoneSnapshot.get('id'))
  };
}, function CassandraTopologyInfo({snapshot, zoneSnapshot, href}) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      {zoneSnapshot ?
        <DescriptionItem href={href}
                         title='Cluster'>
          {getLabel(zoneSnapshot)}
        </DescriptionItem>
      : null}

      <DescriptionItem title='Datacenter'>
        {data.get('datacenter')}
      </DescriptionItem>

      <DescriptionItem title='Rack'>
        {data.get('rack')}
      </DescriptionItem>

      <DescriptionItem title='Host-Id'>
        {data.get('hostId')}
      </DescriptionItem>

    </DescriptionList>
  );
}));
