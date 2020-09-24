import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function NetCoreInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
      <DescriptionItem title="Runtime-Version">{data.get('rv', 'UNKNOWN')}</DescriptionItem>
      <DescriptionItem title="Target-Version">{data.get('tv', 'UNKNOWN')}</DescriptionItem>
    </DescriptionList>
  );
}
