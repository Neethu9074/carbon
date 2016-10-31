import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';


export default function KafkaInfo({snapshot}) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title='Version'>
        {data.get('version')}
      </DescriptionItem>
      <DescriptionItem title='Zookeeper Connect'>
        {data.get('config.zookeeper')}
      </DescriptionItem>
      <DescriptionItem title='Process ID'>
        {data.get('pid')}
      </DescriptionItem>
    </DescriptionList>
  );
}
