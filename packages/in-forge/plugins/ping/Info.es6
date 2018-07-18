import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Label">{data.get('label')}</DescriptionItem>
      <DescriptionItem title="Type">{data.get('type')}</DescriptionItem>
      <DescriptionItem title="Target">{data.get('target')}</DescriptionItem>
    </DescriptionList>
  );
}
