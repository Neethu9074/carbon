import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {formatDateTime} from 'in-services/formatters/date';
import {emptyList} from 'in-services/fixedImmutables';


export default function BrokerInfo({snapshot}) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title='Version'>
        {data.get('version')}
      </DescriptionItem>
      <DescriptionItem title='Broker Name'>
        {data.get('brokerName')}
      </DescriptionItem>
      <DescriptionItem title='Started At'>
        {formatDateTime(data.get('startedAt'))}
      </DescriptionItem>
      <DescriptionItem title='Health Status'>
        {data.get('healthStatus')}
      </DescriptionItem>
      <DescriptionItem title='Ports'>
        {data.get('ports', emptyList).sort().join(', ')}
      </DescriptionItem>
      <DescriptionItem title='Broker Id'>
        {data.get('brokerId')}
      </DescriptionItem>
      <DescriptionItem title='Memory Limit'>
        {data.get('memoryLimit')}
      </DescriptionItem>
      <DescriptionItem title='Store Limit'>
        {data.get('storeLimit')}
      </DescriptionItem>
      <DescriptionItem title='Queues Count'>
        {data.get('queues', emptyList).size}
      </DescriptionItem>
      <DescriptionItem title='Topics Count'>
        {data.get('topics', emptyList).size}
      </DescriptionItem>
    </DescriptionList>
  );
}

BrokerInfo.propTypes = {
  snapshot: irpt.map.isRequired
};
