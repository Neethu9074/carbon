import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {emptyList} from 'in-services/fixedImmutables';
import {bytesTwoDecimalPlaces} from 'in-services/formatters/number';


export default function Info({snapshot}) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title='Version'>
        {data.get('version')}
      </DescriptionItem>
      <DescriptionItem title='Broker Name'>
        {data.get('brokerName')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title='Health Status'>
        {data.get('healthStatus')}
      </DescriptionItem>
      <DescriptionItem title='Ports'>
        {data.get('ports', emptyList).sort().join(', ')}
      </DescriptionItem>
      <DescriptionItem title='Memory Limit'>
        {bytesTwoDecimalPlaces(data.get('memoryLimit'))}
      </DescriptionItem>
      <DescriptionItem title='Store Limit'>
        {bytesTwoDecimalPlaces(data.get('storeLimit'))}
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
