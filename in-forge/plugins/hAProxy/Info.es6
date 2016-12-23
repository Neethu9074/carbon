import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';


export default function HAProxyInfo({snapshot}) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title='Version'>
        {data.get('info.version')}
      </DescriptionItem>
      <DescriptionItem title='Name'>
        {data.get('info.name')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title='Max Memory'>
        {data.get('info.memmax')}
      </DescriptionItem>
      <DescriptionItem title='Ulimit-n'>
        {data.get('info.ulimitN')}
      </DescriptionItem>
      <DescriptionItem title='Max Sockets'>
        {data.get('info.maxsock')}
      </DescriptionItem>
      <DescriptionItem title='Max Connections'>
        {data.get('info.maxconn')}
      </DescriptionItem>
      <DescriptionItem title='Max pipes'>
        {data.get('info.maxpipes')}
      </DescriptionItem>
      <DescriptionItem title='Session Rate Limit'>
        {data.get('info.sessRateLimit')}
      </DescriptionItem>
    </DescriptionList>
  );
}
