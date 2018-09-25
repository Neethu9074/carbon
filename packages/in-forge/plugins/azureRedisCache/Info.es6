import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>

        <DescriptionItem title="Version">{data.get('redisVersion')}</DescriptionItem>

        <DescriptionItem title="Location">{data.get('location')}</DescriptionItem>

        <DescriptionItem title="Host Name">{data.get('hostName')}</DescriptionItem>

        <DescriptionItem title="Port">{data.get('port')}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
