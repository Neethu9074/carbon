import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="Name">{data.get('clusterName')}</DescriptionItem>
      <DescriptionItem title="Started at">{data.get('clusterDateTime')}</DescriptionItem>
      <DescriptionItem title="Alternated at">{data.get('clusterAlternated')}</DescriptionItem>
    </DescriptionList>
  );
}
