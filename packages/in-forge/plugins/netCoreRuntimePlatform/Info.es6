import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function NetCoreInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
    </DescriptionList>
  );
}
