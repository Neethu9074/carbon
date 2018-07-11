import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Endpoint">{data.get('endpoint')}</DescriptionItem>
      <DescriptionItem title="Host">{data.get('host')}</DescriptionItem>
    </DescriptionList>
  );
}
