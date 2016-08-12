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
}, function ElasticsearchInfo({snapshot, zoneSnapshot, href}) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title='Version'>
        {data.get('version')}
      </DescriptionItem>

      {zoneSnapshot ?
        <DescriptionItem href={href}
                         title='Cluster'>
          {getLabel(zoneSnapshot)}
        </DescriptionItem>
      : null}

      <DescriptionItem title='Node'>
        {data.get('node.name')}
      </DescriptionItem>

      <DescriptionItem title='Node Type'>
        {data.get('node.type')}
      </DescriptionItem>

      <DescriptionItem title='Master'>
        {data.get('node.master')}
      </DescriptionItem>

      <DescriptionItem title='Master Eligible'>
        {data.get('node.master_eligible')}
      </DescriptionItem>

      <DescriptionItem title='Transport'>
        {data.get('transport')}
      </DescriptionItem>

      <DescriptionItem title='Log Directory'>
        {data.get('log.dir')}
      </DescriptionItem>
    </DescriptionList>
  );
}));
