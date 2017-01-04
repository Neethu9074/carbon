import React from 'react';

import {emptyList} from 'in-services/fixedImmutables';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';


export default function Info({snapshot}) {
  const data = snapshot.get('data');
  const nodes = snapshot.getIn(['data', 'nodes'], emptyList);

  return (
    <DescriptionList>
      <DescriptionItem title='Cluster Name'>
        {data.get('clusterName')}
      </DescriptionItem>
      <DescriptionItem title='Zookeeper'>
        {data.get('zookeeper')}
      </DescriptionItem>
      <DescriptionItem title='Nodes'>
        {nodes.size}
      </DescriptionItem>
    </DescriptionList>
  );
}
