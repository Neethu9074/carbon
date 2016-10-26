import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {bytesTwoDecimalPlaces} from 'in-services/formatters/number';


export default function HardwareInfo({snapshot}) {
  const data = snapshot.get('data');
  const memoryTotal = data.get('memory.total');

  return (
    <DescriptionList>
      <DescriptionItem title='OS'>
        {data.get('os.name')} {data.get('os.version')} ({data.get('os.arch')})
      </DescriptionItem>

      <DescriptionItem title='CPU'>
        {data.get('cpu.count')} x {data.get('cpu.model')}
      </DescriptionItem>

      {memoryTotal != null ?
        <DescriptionItem title='Memory'>
          {bytesTwoDecimalPlaces(memoryTotal)}
        </DescriptionItem>
      : null}

      <DescriptionItem title='Hostname'>
        {data.get('hostname')}
      </DescriptionItem>

      <DescriptionItem title='FQDN'>
        {data.get('fqdn')}
      </DescriptionItem>
    </DescriptionList>
  );
}
