import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="Name">{data.get('listenerName')}</DescriptionItem>
      <DescriptionItem title="Status">{data.get('listenerStatus')}</DescriptionItem>
      <DescriptionItem title="Queue Manager">{data.get('qmName')}</DescriptionItem>
      <DescriptionItem title="IP Address">{data.get('listenerIpAddress')}</DescriptionItem>
      <DescriptionItem title="Port">{data.get('listenerPort')}</DescriptionItem>
      <DescriptionItem title="Started At">{data.get('listenerStartedAt')}</DescriptionItem>
    </DescriptionList>
  );
}
